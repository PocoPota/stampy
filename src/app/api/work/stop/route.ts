import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId, description } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const activeRecord = await prisma.workRecord.findFirst({
    where: {
      userId,
      endTime: null,
    },
    orderBy: {
      startTime: "desc",
    },
  });

  if (!activeRecord) {
    return NextResponse.json({ error: "未完了の勤務記録が見つかりません" }, { status: 404 });
  }

  const now = new Date();
  const durationMs = now.getTime() - new Date(activeRecord.startTime).getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  const wage = Math.round(durationHours * activeRecord.hourlyRate);

  await prisma.workRecord.update({
    where: { id: activeRecord.id },
    data: {
      endTime: now,
      wage,
      description: description || "",
    },
  });

  return NextResponse.json({ message: "勤務終了を記録しました", wage });
}
