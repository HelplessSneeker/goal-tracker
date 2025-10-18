"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteRegionDialog } from "@/components/regions";
import { Region } from "@/lib/types";

interface RegionDetailHeaderProps {
  region: Region;
  goalId: string;
}

export function RegionDetailHeader({ region, goalId }: RegionDetailHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-4xl font-bold">{region.title}</h1>
          <div className="flex gap-2">
            <Link href={`/goals/${goalId}/${region.id}/edit`}>
              <Button size="sm" variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              className="gap-2"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">{region.description}</p>
      </div>

      <DeleteRegionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        regionId={region.id}
        regionTitle={region.title}
        goalId={goalId}
      />
    </>
  );
}
