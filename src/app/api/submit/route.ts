import { NextRequest, NextResponse } from "next/server";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const TABLE_NOT_FOUND = "42P01";
const COLUMN_NOT_FOUND = "42703";
const NOT_NULL_VIOLATION = "23502";

interface SubmitPayload {
  name: string;
  address: string;
  city: string;
  state: string;
  googleMapsLink?: string;
  sweet_type: string;
  distribution_time?: string;
  crowd_level?: string;
  taraweehDates?: string[];
  target?: "pending" | "approved";
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

function toCoordinates(latitude: string, longitude: string): Coordinates | null {
  const lat = Number.parseFloat(latitude);
  const lng = Number.parseFloat(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return { latitude: lat, longitude: lng };
}

function extractLatLng(value: string): Coordinates | null {
  const patterns = [
    /[?&]q=([-\d.]+),([-\d.]+)/,
    /@([-\d.]+),([-\d.]+)/,
    /!3d([-\d.]+)!4d([-\d.]+)/,
    /[?&]ll=([-\d.]+),([-\d.]+)/,
    /[?&]query=([-\d.]+)%2C([-\d.]+)/,
    /"lat"\s*:\s*([-\d.]+)\s*,\s*"lng"\s*:\s*([-\d.]+)/,
    /"center"\s*:\s*\{\s*"lat"\s*:\s*([-\d.]+)\s*,\s*"lng"\s*:\s*([-\d.]+)/,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (!match) continue;

    const coordinates = toCoordinates(match[1], match[2]);
    if (coordinates) {
      return coordinates;
    }
  }

  return null;
}

async function resolveCoordinatesFromMapsLink(link: string): Promise<Coordinates | null> {
  const direct = extractLatLng(link);
  if (direct) {
    return direct;
  }

  try {
    const response = await fetch(link, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: {
        "user-agent": "TaraweehFinder/1.0",
      },
    });

    const finalUrlCoords = extractLatLng(response.url);
    if (finalUrlCoords) {
      return finalUrlCoords;
    }

    const html = await response.text();
    return extractLatLng(html);
  } catch {
    return null;
  }
}

async function resolveCoordinatesFromAddress(address: string, city: string, state: string) {
  const query = [address, city, state].filter(Boolean).join(", ");

  if (!query) {
    return null;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "user-agent": "TaraweehFinder/1.0",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as Array<{ lat: string; lon: string }>;
    if (!data[0]) {
      return null;
    }

    return toCoordinates(data[0].lat, data[0].lon);
  } catch {
    return null;
  }
}

async function resolveCoordinates(payload: {
  googleMapsLink?: string;
  address: string;
  city: string;
  state: string;
}) {
  const trimmedLink = payload.googleMapsLink?.trim();

  if (trimmedLink) {
    const mapCoordinates = await resolveCoordinatesFromMapsLink(trimmedLink);
    if (mapCoordinates) {
      return mapCoordinates;
    }
  }

  return resolveCoordinatesFromAddress(payload.address, payload.city, payload.state);
}

function hasErrorCode(error: PostgrestError | null, code: string) {
  return Boolean(error && error.code === code);
}

function formatInsertError(error?: PostgrestError | null) {
  if (!error) {
    return "Failed to submit mosque";
  }

  if (error.code === NOT_NULL_VIOLATION) {
    return "Could not determine map coordinates from the provided location details. Add a Google Maps link or a more specific address.";
  }

  return error.message;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<SubmitPayload>;

    const {
      name,
      address,
      city,
      state,
      googleMapsLink,
      sweet_type,
      distribution_time,
      crowd_level,
      target = "pending",
      taraweehDates = [],
    } = body;

    if (!name || !address || !city || !state || !sweet_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const coordinates = await resolveCoordinates({
      googleMapsLink,
      address,
      city,
      state,
    });

    const sessions = (Array.isArray(taraweehDates) ? taraweehDates : [])
      .filter(Boolean)
      .map((date, index) => ({
        taraweeh_end_date: date,
        session_number: index + 1,
      }));

    const latitude = coordinates?.latitude ?? null;
    const longitude = coordinates?.longitude ?? null;

    if (target === "approved") {
      const token = req.cookies.get("admin_token")?.value;
      if (token !== "authenticated") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { data: mosque, error } = await supabase
        .from("approved_mosques")
        .insert([
          {
            name,
            address,
            city,
            state,
            latitude,
            longitude,
            sweet_type,
            distribution_time: distribution_time || null,
            crowd_level: crowd_level || null,
            upvotes: 0,
            views: 0,
            approved_at: new Date().toISOString(),
          },
        ])
        .select("id")
        .single();

      if (error || !mosque) {
        return NextResponse.json(
          { error: formatInsertError(error) },
          { status: 500 }
        );
      }

      if (sessions.length > 0) {
        const { error: sessionError } = await supabase
          .from("taraweeh_sessions")
          .insert(sessions.map((session) => ({ ...session, mosque_id: mosque.id })));

        if (sessionError) {
          return NextResponse.json({ error: sessionError.message }, { status: 500 });
        }
      }

      return NextResponse.json({ success: true, mode: "approved" });
    }

    const pendingBase = {
      name,
      address,
      city,
      state,
      latitude,
      longitude,
      sweet_type,
      distribution_time: distribution_time || null,
      crowd_level: crowd_level || null,
      status: "pending",
    };

    const primaryInsert = await supabase
      .from("mosque_submissions")
      .insert([
        {
          ...pendingBase,
          taraweeh_end_date: sessions[0]?.taraweeh_end_date || null,
        },
      ])
      .select("id")
      .single();

    let submissionId: string | null = null;

    if (primaryInsert.data?.id) {
      submissionId = primaryInsert.data.id;
    }

    if (hasErrorCode(primaryInsert.error, COLUMN_NOT_FOUND)) {
      const fallbackColumnInsert = await supabase
        .from("mosque_submissions")
        .insert([pendingBase])
        .select("id")
        .single();

      if (fallbackColumnInsert.error || !fallbackColumnInsert.data) {
        return NextResponse.json(
          { error: formatInsertError(fallbackColumnInsert.error) },
          { status: 500 }
        );
      }

      submissionId = fallbackColumnInsert.data.id;
    }

    if (hasErrorCode(primaryInsert.error, TABLE_NOT_FOUND)) {
      const pendingMosqueInsert = await supabase
        .from("pending_mosques")
        .insert([
          {
            ...pendingBase,
            approved_at: null,
          },
        ])
        .select("id")
        .single();

      if (pendingMosqueInsert.error || !pendingMosqueInsert.data) {
        return NextResponse.json(
          { error: formatInsertError(pendingMosqueInsert.error) },
          { status: 500 }
        );
      }

      submissionId = pendingMosqueInsert.data.id;

      if (sessions.length > 0) {
        const { error: pendingSessionError } = await supabase
          .from("pending_taraweeh_sessions")
          .insert(sessions.map((session) => ({ ...session, mosque_id: submissionId })));

        if (pendingSessionError) {
          return NextResponse.json(
            { error: pendingSessionError.message },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({ success: true, mode: "pending" });
    }

    if (primaryInsert.error && !hasErrorCode(primaryInsert.error, COLUMN_NOT_FOUND)) {
      return NextResponse.json(
        { error: formatInsertError(primaryInsert.error) },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, mode: "pending", submissionId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
