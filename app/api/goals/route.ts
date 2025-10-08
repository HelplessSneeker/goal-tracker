import { NextResponse } from "next/server";
import { mockGoals } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockGoals);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newGoal = {
    id: String(mockGoals.length + 1),
    title: body.title,
    description: body.description,
  };
  mockGoals.push(newGoal);
  return NextResponse.json(newGoal, { status: 201 });
}
