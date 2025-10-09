import { Goal, Subgoal } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

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

async function getSubgoals(goalId: string): Promise<Subgoal[]> {
  try {
    const res = await fetch(
      `http://localhost:3000/api/subgoals?goalId=${goalId}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch subgoals:", error);
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

  const subgoals = await getSubgoals(id);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Goals
      </Link>

      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">{goal.title}</h1>
        <p className="text-lg text-muted-foreground">{goal.description}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Subgoals</h2>
        {subgoals.length > 0 ? (
          <div className="grid gap-4">
            {subgoals.map((subgoal) => (
              <Card key={subgoal.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{subgoal.title}</CardTitle>
                  <CardDescription>{subgoal.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No subgoals for this goal yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
