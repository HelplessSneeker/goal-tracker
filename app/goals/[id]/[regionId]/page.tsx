import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/tasks";
import { RegionDetailHeader } from "@/components/regions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRegionById } from "@/lib/services/regions.service";
import { getTasksForRegion } from "@/lib/services/tasks.service";

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ id: string; regionId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/auth/signin");
  }

  const { id, regionId } = await params;
  const region = await getRegionById(regionId, session.user.id);

  if (!region) {
    notFound();
  }

  const tasks = await getTasksForRegion(regionId, session.user.id);

  return (
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <Link
        href={`/goals/${id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Goal
      </Link>

      <RegionDetailHeader region={region} goalId={id} />

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
