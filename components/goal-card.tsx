import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Goal, Subgoal } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface GoalCardProps {
  goal: Goal;
  subgoals: Subgoal[];
}

export function GoalCard({ goal, subgoals }: GoalCardProps) {
  return (
    <Link href={`/goals/${goal.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow group h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle>{goal.title}</CardTitle>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
          <CardDescription>{goal.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col min-h-0">
          {subgoals.length > 0 && (
            <div className="flex flex-col min-h-0">
              <p className="text-sm font-medium mb-2 flex-shrink-0">Subgoals:</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 overflow-y-auto max-h-32">
                {subgoals.map((subgoal) => (
                  <li key={subgoal.id}>{subgoal.title}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
