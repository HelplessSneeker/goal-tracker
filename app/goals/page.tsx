import { Goal, Region } from "@/lib/types";
import { GoalCard } from "@/components/goals/goal-card";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getGoals(): Promise<Goal[]> {
  const res = await fetch("http://localhost:3000/api/goals", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch goals");
  }
  return res.json();
}

async function getRegions(): Promise<Region[]> {
  const res = await fetch("http://localhost:3000/api/regions", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch regions");
  }
  return res.json();
}

export default async function GoalsPage() {
  const goals = await getGoals();
  const regions = await getRegions();

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Goals</h1>
        <Link href="/goals/create">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => {
          const goalRegions = regions.filter((r) => r.goalId === goal.id);
          return <GoalCard key={goal.id} goal={goal} regions={goalRegions} />;
        })}
      </div>
    </div>
  );
}
