"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TaskFormProps {
  mode: "create" | "edit";
  regionId: string;
  goalId?: string;
  initialData?: {
    id: string;
    regionId: string;
    title: string;
    description: string;
    deadline: string;
    status: "active" | "completed";
    createdAt: string;
  };
  taskId?: string;
  onSuccess?: () => void;
}

export function TaskForm({
  mode,
  regionId,
  goalId,
  initialData,
  taskId,
  onSuccess,
}: TaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  // Convert ISO string to YYYY-MM-DD format for input
  const [deadline, setDeadline] = useState(
    initialData?.deadline ? initialData.deadline.split("T")[0] : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const url = mode === "create" ? "/api/tasks" : `/api/tasks/${taskId}`;
      const method = mode === "create" ? "POST" : "PUT";

      // Convert date to ISO string for API
      const deadlineISO = new Date(deadline).toISOString();

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          regionId,
          title,
          description,
          deadline: deadlineISO,
        }),
      });

      if (!res.ok) {
        throw new Error(
          `Failed to ${mode === "create" ? "create" : "update"} task`
        );
      }

      if (onSuccess) {
        onSuccess();
      } else if (mode === "create" && goalId) {
        router.push(`/goals/${goalId}/${regionId}`);
        router.refresh();
      } else if (mode === "edit" && goalId && taskId) {
        router.push(`/goals/${goalId}/${regionId}/tasks/${taskId}`);
        router.refresh();
      } else {
        router.back();
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create New Task" : "Edit Task"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Add a new task with a deadline to create urgency"
            : "Update your task information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Build 3 projects using Server Components"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Describe this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isSubmitting}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="deadline"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Deadline
            </label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Task"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
