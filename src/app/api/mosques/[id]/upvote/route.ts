import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing mosque id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("approved_mosques")
    .select("upvotes")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Mosque not found" },
      { status: 404 }
    );
  }

  const nextUpvotes = (data.upvotes || 0) + 1;
  const { error: updateError } = await supabase
    .from("approved_mosques")
    .update({ upvotes: nextUpvotes })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, upvotes: nextUpvotes });
}
