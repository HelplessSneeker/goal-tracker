"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { GoalForm } from "@/components/goals";

export default function CreateGoalPage() {
  return (
    <div className="container mx-auto p-6 max-w-2xl animate-fade-in">
      <Link
        href="/goals"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Goals
      </Link>

      <GoalForm mode="create" />
    </div>
  );
}
