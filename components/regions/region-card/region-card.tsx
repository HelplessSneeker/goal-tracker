"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Region } from "@/lib/types";

interface RegionCardProps {
  region: Region;
  goalId: string;
}

export function RegionCard({ region, goalId }: RegionCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/goals/${goalId}/${region.id}`);
  };

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-lg"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{region.title}</CardTitle>
        <CardDescription>{region.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
