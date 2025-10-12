"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Region } from "@/lib/types";
import { DeleteRegionDialog } from "./delete-region-dialog";

interface RegionCardProps {
  region: Region;
  goalId: string;
}

export function RegionCard({ region, goalId }: RegionCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg">{region.title}</CardTitle>
              <CardDescription>{region.description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/goals/${goalId}/${region.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 w-9 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/goals/${goalId}/${region.id}/edit`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 w-9 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 w-9 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
      </Card>

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
