import { NextResponse } from "next/server";
import { mockTasks } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionId = searchParams.get("regionId");

  if (regionId) {
    const filteredTasks = mockTasks.filter((t) => t.regionId === regionId);
    return NextResponse.json(filteredTasks);
  }

  return NextResponse.json(mockTasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newTask = {
    id: String(mockTasks.length + 1),
    regionId: body.regionId,
    title: body.title,
    description: body.description,
    deadline: body.deadline,
    status: "active" as const,
    createdAt: new Date().toISOString(),
  };
  mockTasks.push(newTask);
  return NextResponse.json(newTask, { status: 201 });
}
