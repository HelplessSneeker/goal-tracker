import { NextResponse } from "next/server";
import { mockRegions } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const region = mockRegions.find((r) => r.id === id);

  if (!region) {
    return NextResponse.json({ error: "Region not found" }, { status: 404 });
  }

  return NextResponse.json(region);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const index = mockRegions.findIndex((r) => r.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Region not found" }, { status: 404 });
  }

  mockRegions[index] = { ...mockRegions[index], ...body };
  return NextResponse.json(mockRegions[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockRegions.findIndex((r) => r.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Region not found" }, { status: 404 });
  }

  mockRegions.splice(index, 1);
  return NextResponse.json({ success: true });
}
