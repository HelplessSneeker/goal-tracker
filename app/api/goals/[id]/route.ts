import { NextResponse } from "next/server";
import { mockGoals } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const goal = mockGoals.find((g) => g.id === id);

  if (!goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  return NextResponse.json(goal);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const index = mockGoals.findIndex((g) => g.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  mockGoals[index] = { ...mockGoals[index], ...body };
  return NextResponse.json(mockGoals[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const index = mockGoals.findIndex((g) => g.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  mockGoals.splice(index, 1);
  return NextResponse.json({ success: true });
}
