import { Goal, Region } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { GoalDetailHeader } from "@/components/goals/goal-detail-header";
import { Button } from "@/components/ui/button";
import { RegionCard } from "@/components/regions/region-card";

async function getGoal(id: string): Promise<Goal | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/goals/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch goal:", error);
    return null;
  }
}

async function getRegions(goalId: string): Promise<Region[]> {
  try {
    const res = await fetch(
      `http://localhost:3000/api/regions?goalId=${goalId}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch regions:", error);
    return [];
  }
}

export default async function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const goal = await getGoal(id);

  if (!goal) {
    notFound();
  }

  const regions = await getRegions(id);

  return (
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <Link
        href="/goals"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Goals
      </Link>

      <GoalDetailHeader goal={goal} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Regions</h2>
          <Link href={`/goals/${id}/addRegion`}>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Region
            </Button>
          </Link>
        </div>
        {regions.length > 0 ? (
          <div className="grid gap-4">
            {regions.map((region) => (
              <RegionCard key={region.id} region={region} goalId={id} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No regions for this goal yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
