import { Goal, Region } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { GoalDetailHeader } from "@/components/goals/goal-detail-header";

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
        <h2 className="text-2xl font-semibold mb-4">Regions</h2>
        {regions.length > 0 ? (
          <div className="grid gap-4">
            {regions.map((region) => (
              <Link
                key={region.id}
                href={`/goals/${id}/${region.id}`}
                className="group block transition-all hover:scale-[1.02]"
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {region.title}
                        </CardTitle>
                        <CardDescription>{region.description}</CardDescription>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
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
