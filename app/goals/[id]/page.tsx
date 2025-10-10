import { Goal, Subgoal } from "@/lib/types";
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
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <Link
        href="/goals"
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
              <Link
                key={subgoal.id}
                href={`/goals/${id}/${subgoal.id}`}
                className="group block transition-all hover:scale-[1.02]"
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {subgoal.title}
                        </CardTitle>
                        <CardDescription>{subgoal.description}</CardDescription>
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
                No subgoals for this goal yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
