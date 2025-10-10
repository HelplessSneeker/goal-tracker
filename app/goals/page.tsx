import { Goal, Subgoal } from "@/lib/types";
import { GoalCard } from "@/components/goal-card";

async function getGoals(): Promise<Goal[]> {
  const res = await fetch("http://localhost:3000/api/goals", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch goals");
  }
  return res.json();
}

async function getSubgoals(): Promise<Subgoal[]> {
  const res = await fetch("http://localhost:3000/api/subgoals", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch subgoals");
  }
  return res.json();
}

export default async function GoalsPage() {
  const goals = await getGoals();
  const subgoals = await getSubgoals();

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">My Goals</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => {
          const goalSubgoals = subgoals.filter((s) => s.goalId === goal.id);
          return (
            <GoalCard key={goal.id} goal={goal} subgoals={goalSubgoals} />
          );
        })}
      </div>
    </div>
  );
}
