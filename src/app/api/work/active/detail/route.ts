import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const record = await prisma.workRecord.findFirst({
    where: {
      userId,
      endTime: null,
    },
    orderBy: {
      startTime: "desc",
    },
    select: {
      startTime: true,
      hourlyRate: true,
    },
  });

  if (!record) {
    return NextResponse.json({ record: null });
  }

  return NextResponse.json({ record });
}
