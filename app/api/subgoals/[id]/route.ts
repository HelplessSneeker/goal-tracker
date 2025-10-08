import { NextResponse } from "next/server";
import { mockSubgoals } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const subgoal = mockSubgoals.find((s) => s.id === id);

  if (!subgoal) {
    return NextResponse.json({ error: "Subgoal not found" }, { status: 404 });
  }

  return NextResponse.json(subgoal);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const index = mockSubgoals.findIndex((s) => s.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Subgoal not found" }, { status: 404 });
  }

  mockSubgoals[index] = { ...mockSubgoals[index], ...body };
  return NextResponse.json(mockSubgoals[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockSubgoals.findIndex((s) => s.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Subgoal not found" }, { status: 404 });
  }

  mockSubgoals.splice(index, 1);
  return NextResponse.json({ success: true });
}
