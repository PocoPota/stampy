import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, hourlyRate } = await req.json();

    if (!userId || typeof hourlyRate !== "number") {
      return NextResponse.json({ error: "不正な入力です" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { hourlyRate },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("時給更新エラー:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
