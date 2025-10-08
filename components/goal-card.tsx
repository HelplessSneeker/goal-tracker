"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Goal, Subgoal } from "@/lib/types";
import { ChevronRight } from "lucide-react";

interface GoalCardProps {
  goal: Goal;
  subgoals: Subgoal[];
}

export function GoalCard({ goal, subgoals }: GoalCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{goal.title}</CardTitle>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <CardDescription>{goal.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {subgoals.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Subgoals:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  {subgoals.map((subgoal) => (
                    <li key={subgoal.id}>{subgoal.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{goal.title}</DialogTitle>
          <DialogDescription>{goal.description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {subgoals.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold mb-3">Subgoals</h3>
              <div className="space-y-3">
                {subgoals.map((subgoal) => (
                  <div
                    key={subgoal.id}
                    className="border rounded-lg p-3 bg-muted/50"
                  >
                    <h4 className="font-medium text-sm mb-1">{subgoal.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {subgoal.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No subgoals for this goal yet.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
