import { Region, Task } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/tasks/task-card/task-card";

async function getRegion(regionId: string): Promise<Region | null> {
  try {
    const res = await fetch(
      `http://localhost:3000/api/regions/${regionId}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch region:", error);
    return null;
  }
}

async function getTasks(regionId: string): Promise<Task[]> {
  try {
    const res = await fetch(
      `http://localhost:3000/api/tasks?regionId=${regionId}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return [];
  }
}

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ id: string; regionId: string }>;
}) {
  const { id, regionId } = await params;
  const region = await getRegion(regionId);

  if (!region) {
    notFound();
  }

  const tasks = await getTasks(regionId);

  return (
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <Link
        href={`/goals/${id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Goal
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl">{region.title}</CardTitle>
          <CardDescription className="text-base">
            {region.description}
          </CardDescription>
        </CardHeader>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Tasks</h2>
          <Link href={`/goals/${id}/${regionId}/addTask`}>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </Link>
        </div>
        {tasks.length > 0 ? (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} goalId={id} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No tasks for this region yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
