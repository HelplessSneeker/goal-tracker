import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const goalId = searchParams.get("goalId");

  const regions = await prisma.region.findMany({
    where: goalId ? { goalId } : undefined,
  });

  return NextResponse.json(regions);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newRegion = await prisma.region.create({
    data: {
      goalId: body.goalId,
      title: body.title,
      description: body.description,
      userId: 0, // todo implement userID
    },
  });
  return NextResponse.json(newRegion, { status: 201 });
}
