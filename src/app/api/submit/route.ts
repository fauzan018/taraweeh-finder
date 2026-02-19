
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function extractLatLng(link: string) {
  // Accepts ?q=lat,lng or @lat,lng
  const q = /[?&]q=([-\d.]+),([-\d.]+)/;
  const at = /@([-\d.]+),([-\d.]+)/;
  let m = link.match(q) || link.match(at);
  if (!m) return null;
  return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) };
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, address, city, googleMapsLink, sweet_type, distribution_time, crowd_level, taraweehDates } = data;
    if (!name || !address || !city || !sweet_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    let latitude = null, longitude = null;
    if (googleMapsLink) {
      const latlng = extractLatLng(googleMapsLink);
      if (latlng) {
        latitude = latlng.latitude;
        longitude = latlng.longitude;
      }
    }
    // Insert mosque (latitude, longitude only from Google Maps link)
    const { data: mosque, error } = await supabase.from("pending_mosques").insert([
      {
        name,
        address,
        city,
        latitude,
        longitude,
        sweet_type,
        distribution_time: distribution_time || null,
        crowd_level: crowd_level || null,
      }
    ]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    // Insert sessions
    if (Array.isArray(taraweehDates) && mosque && mosque.id) {
      const sessions = taraweehDates.filter(Boolean).map((date, i) => ({
        mosque_id: mosque.id,
        taraweeh_end_date: date,
        session_number: i + 1,
      }));
      if (sessions.length) {
        const { error: sessionError } = await supabase.from("pending_taraweeh_sessions").insert(sessions);
        if (sessionError) return NextResponse.json({ error: sessionError.message }, { status: 500 });
      }
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    let errorMsg = "Unknown error";
    if (typeof e === "object" && e && "message" in e) {
      errorMsg = (e as any).message;
    }
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
