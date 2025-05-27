import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { id } });

  if (!existing) {
    await prisma.user.create({
      data: {
        id,
        hourlyRate: 2500,
      },
    });
  }

  return NextResponse.json({ success: true });
}
