import { NextRequest, NextResponse } from "next/server";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const TABLE_NOT_FOUND = "42P01";
const COLUMN_NOT_FOUND = "42703";

interface SubmitPayload {
  name: string;
  address: string;
  city: string;
  state: string;
  googleMapsLink: string;
  sweet_type: string;
  distribution_time?: string;
  crowd_level?: string;
  taraweehDates?: string[];
  target?: "pending" | "approved";
}

function extractLatLng(link: string) {
  const patterns = [
    /[?&]q=([-\d.]+),([-\d.]+)/,
    /@([-\d.]+),([-\d.]+)/,
    /!3d([-\d.]+)!4d([-\d.]+)/,
    /[?&]ll=([-\d.]+),([-\d.]+)/,
  ];

  for (const pattern of patterns) {
    const match = link.match(pattern);
    if (!match) continue;

    return {
      latitude: Number.parseFloat(match[1]),
      longitude: Number.parseFloat(match[2]),
    };
  }

  return null;
}

function hasErrorCode(error: PostgrestError | null, code: string) {
  return Boolean(error && error.code === code);
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

    if (!name || !address || !city || !state || !sweet_type || !googleMapsLink) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const latlng = extractLatLng(googleMapsLink);
    if (!latlng) {
      return NextResponse.json(
        {
          error:
            "Could not read coordinates from Google Maps link. Use a link containing coordinates.",
        },
        { status: 400 }
      );
    }

    const sessions = (Array.isArray(taraweehDates) ? taraweehDates : [])
      .filter(Boolean)
      .map((date, index) => ({
        taraweeh_end_date: date,
        session_number: index + 1,
      }));

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
            latitude: latlng.latitude,
            longitude: latlng.longitude,
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
          { error: error?.message || "Failed to add mosque" },
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
      latitude: latlng.latitude,
      longitude: latlng.longitude,
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
          { error: fallbackColumnInsert.error?.message || "Failed to submit mosque" },
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
          { error: pendingMosqueInsert.error?.message || "Failed to submit mosque" },
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
      return NextResponse.json({ error: primaryInsert.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, mode: "pending", submissionId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
