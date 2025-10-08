import { NextResponse } from "next/server";
import { mockSubgoals } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const goalId = searchParams.get("goalId");

  if (goalId) {
    const filteredSubgoals = mockSubgoals.filter((s) => s.goalId === goalId);
    return NextResponse.json(filteredSubgoals);
  }

  return NextResponse.json(mockSubgoals);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newSubgoal = {
    id: String(mockSubgoals.length + 1),
    goalId: body.goalId,
    title: body.title,
    description: body.description,
  };
  mockSubgoals.push(newSubgoal);
  return NextResponse.json(newSubgoal, { status: 201 });
}
