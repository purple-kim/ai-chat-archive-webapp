import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TOPIC_LABELS, sourceLabel } from "@/lib/topics";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get("format") ?? "csv";

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("entry_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []).map((e) => ({
    date: e.entry_date,
    source: sourceLabel(e.main, e.sub),
    topic: TOPIC_LABELS[e.topic] ?? e.topic,
    title: e.title,
    content: e.content,
  }));

  if (format === "md") {
    const lines = ["# AI 대화 아카이빙", ""];
    rows.forEach((r) => {
      lines.push(`## ${r.title}`);
      lines.push(`- 날짜: ${r.date}`);
      lines.push(`- 소스: ${r.source}`);
      lines.push(`- 태그: ${r.topic}`);
      lines.push("");
      lines.push(r.content);
      lines.push("\n---\n");
    });
    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": 'attachment; filename="chat-archiving-export.md"',
      },
    });
  }

  const header = ["date", "source_label", "topic_label", "title", "content"];
  const lines = [header.join(",")];
  rows.forEach((r) => {
    lines.push(
      [r.date, r.source, r.topic, r.title, r.content].map(csvEscape).join(",")
    );
  });
  const csv = "﻿" + lines.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="chat-archiving-export.csv"',
    },
  });
}
