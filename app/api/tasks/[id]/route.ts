import { NextResponse } from "next/server";
import { mockTasks } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const task = mockTasks.find((t) => t.id === id);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const index = mockTasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  mockTasks[index] = { ...mockTasks[index], ...body };
  return NextResponse.json(mockTasks[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockTasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  mockTasks.splice(index, 1);
  return NextResponse.json({ success: true });
}
