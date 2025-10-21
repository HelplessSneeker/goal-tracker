import { NextResponse } from "next/server";
import { mockGoals } from "@/lib/mock-data";
import prisma from "@/lib/prisma";

export async function GET() {
  const goals = await prisma.goal.findMany(); // todo filter userID
  return NextResponse.json(goals);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newGoal = await prisma.goal.create({
    data: {
      title: body.title,
      description: body.description,
      userId: 0, // todo implement userID
    },
  });
  return NextResponse.json(newGoal, { status: 201 });
}
