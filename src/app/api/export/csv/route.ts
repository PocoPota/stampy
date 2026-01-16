import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function formatJpDateTime(date: Date | null | undefined) {
  if (!date) return "";
  // YYYY-MM-DD HH:mm in Asia/Tokyo
  const dtf = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = dtf.formatToParts(date).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== "literal") acc[p.type] = p.value;
    return acc;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

function formatDuration(start: Date | null | undefined, end: Date | null | undefined) {
  if (!start || !end) return "継続中";
  const ms = end.getTime() - start.getTime();
  const totalMinutes = Math.max(0, Math.round(ms / (1000 * 60)));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}時間${minutes}分`;
}

function csvEscape(value: string) {
  if (value == null) return "";
  const needsQuote = /[",\n]/.test(value);
  let v = value.replace(/"/g, '""');
  return needsQuote ? `"${v}"` : v;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new NextResponse("userId is required", { status: 400 });
  }

  const records = await prisma.workRecord.findMany({
    where: { userId },
    orderBy: { startTime: "asc" },
  });

  const header = [
    "開始日時",
    "終了日時",
    "勤務時間",
    "時給",
    "金額",
    "勤務内容",
  ].join(",");

  const lines = records.map((r) => {
    const start = r.startTime ? new Date(r.startTime) : null;
    const end = r.endTime ? new Date(r.endTime) : null;
    const startStr = formatJpDateTime(start);
    const endStr = formatJpDateTime(end);
    const durationStr = formatDuration(start, end);
    const hourlyRateStr = r.hourlyRate != null ? String(r.hourlyRate) : "";
    const wageStr = end ? (r.wage != null ? String(r.wage) : "") : "";
    const descStr = csvEscape(r.description || "");
    return [startStr, endStr, durationStr, hourlyRateStr, wageStr, descStr].join(",");
  });

  const csv = [header, ...lines].join("\n");
  // Add BOM for Excel compatibility
  const body = `\ufeff${csv}`;

  const ts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});
  const filename = `work_records_${ts.year}${ts.month}${ts.day}.csv`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${filename}`,
      "Cache-Control": "no-store",
    },
  });
}

