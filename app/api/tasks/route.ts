import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionId = searchParams.get("regionId");

  const tasks = await prisma.task.findMany({
    where: regionId ? { regionId } : undefined,
  });

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newTask = await prisma.task.create({
    data: {
      regionId: body.regionId,
      title: body.title,
      description: body.description,
      deadline: new Date(body.deadline),
      status: "active",
      userId: 0, // todo implement userID
    },
  });
  return NextResponse.json(newTask, { status: 201 });
}
