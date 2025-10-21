import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const region = await prisma.region.findUnique({
    where: { id },
  });

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

  try {
    const updatedRegion = await prisma.region.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        goalId: body.goalId,
      },
    });
    return NextResponse.json(updatedRegion);
  } catch (error) {
    return NextResponse.json({ error: "Region not found" }, { status: 404 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.region.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Region not found" }, { status: 404 });
  }
}
