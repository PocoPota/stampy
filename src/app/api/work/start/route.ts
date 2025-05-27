import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // ユーザーの時給を取得
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 勤務記録を新規作成
  await prisma.workRecord.create({
    data: {
      userId,
      startTime: new Date(),
      hourlyRate: user.hourlyRate,
    },
  });

  return NextResponse.json({ message: "勤務開始記録を作成しました" });
}
