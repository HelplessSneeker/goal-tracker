"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteGoalDialog } from "@/components/goals";
import { Goal } from "@/lib/types";

interface GoalDetailHeaderProps {
  goal: Goal;
}

export function GoalDetailHeader({ goal }: GoalDetailHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const t = useTranslations();

  return (
    <>
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-4xl font-bold">{goal.title}</h1>
          <div className="flex gap-2">
            <Link href={`/goals/${goal.id}/edit`}>
              <Button size="sm" variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" />
                {t("common.edit")}
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              className="gap-2"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              {t("common.delete")}
            </Button>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">{goal.description}</p>
      </div>

      <DeleteGoalDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        goalId={goal.id}
        goalTitle={goal.title}
      />
    </>
  );
}
