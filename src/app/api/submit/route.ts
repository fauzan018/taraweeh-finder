import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
    // Insert into Supabase
    const { error } = await supabase.from("mosques").insert([
      {
        name: data.name,
        address: data.address,
        state: data.state,
        city: data.city,
        google_maps_link: data.googleMapsLink,
        sweet_type: data.sweet_type,
        distribution_time: data.distribution_time || null,
        crowd_level: data.crowd_level || null,
        taraweeh_dates: data.taraweehDates || [],
        status: "pending"
      }
    ]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
