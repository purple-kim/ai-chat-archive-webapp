import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("entry_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ entries: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { main, sub, topic, title, content, entry_date } = body;

  if (!main || !sub || !topic || !title || !content || !entry_date) {
    return NextResponse.json(
      { error: "main, sub, topic, title, content, entry_date는 모두 필수입니다." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("entries")
    .insert({ main, sub, topic, title, content, entry_date })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ entry: data }, { status: 201 });
}
