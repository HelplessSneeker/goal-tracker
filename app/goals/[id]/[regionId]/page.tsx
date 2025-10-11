import { Region } from "@/lib/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

async function getRegion(regionId: string): Promise<Region | null> {
  try {
    const res = await fetch(
      `http://localhost:3000/api/regions/${regionId}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch region:", error);
    return null;
  }
}

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ id: string; regionId: string }>;
}) {
  const { id, regionId } = await params;
  const region = await getRegion(regionId);

  if (!region) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <Link
        href={`/goals/${id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Goal
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{region.title}</CardTitle>
          <CardDescription className="text-base">
            {region.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
