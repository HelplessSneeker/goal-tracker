import { NextResponse } from "next/server";
import { mockRegions } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const goalId = searchParams.get("goalId");

  if (goalId) {
    const filteredRegions = mockRegions.filter((r) => r.goalId === goalId);
    return NextResponse.json(filteredRegions);
  }

  return NextResponse.json(mockRegions);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newRegion = {
    id: String(mockRegions.length + 1),
    goalId: body.goalId,
    title: body.title,
    description: body.description,
  };
  mockRegions.push(newRegion);
  return NextResponse.json(newRegion, { status: 201 });
}
