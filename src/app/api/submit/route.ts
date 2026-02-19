import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Helper to extract lat/lng from Google Maps link
function extractLatLng(link: string): { latitude: number; longitude: number } | null {
  // Handles links like: https://maps.google.com/?q=28.6507,77.2334 or .../@28.6507,77.2334,...
  const regex = /[?&]q=([-\d.]+),([-\d.]+)/;
  const regex2 = /@([-\d.]+),([-\d.]+)/;
  let match = link.match(regex);
  if (!match) match = link.match(regex2);
  if (match) {
    return { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) };
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Validate required fields
    const required = ["name", "address", "state", "city", "googleMapsLink", "sweet_type"];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }
    const latlng = extractLatLng(data.googleMapsLink);
    if (!latlng) {
      return NextResponse.json({ error: "Invalid Google Maps link. Could not extract coordinates." }, { status: 400 });
    }
    // Insert into pending_mosques
    const { error, data: mosque } = await supabase.from("pending_mosques").insert([
      {
        name: data.name,
        address: data.address,
        state: data.state,
        city: data.city,
        latitude: latlng.latitude,
        longitude: latlng.longitude,
        sweet_type: data.sweet_type,
        distribution_time: data.distribution_time || null,
        crowd_level: data.crowd_level || null,
      }
    ]).select().single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Insert taraweeh sessions if provided
    if (Array.isArray(data.taraweehDates) && mosque && mosque.id) {
      const sessions = data.taraweehDates.filter(Boolean).map((date: string, idx: number) => ({
        mosque_id: mosque.id,
        taraweeh_end_date: date,
        session_number: idx + 1,
      }));
      if (sessions.length > 0) {
        const { error: sessionError } = await supabase.from("pending_taraweeh_sessions").insert(sessions);
        if (sessionError) {
          return NextResponse.json({ error: sessionError.message }, { status: 500 });
        }
      }
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
