import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Goal, Region } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface GoalCardProps {
  goal: Goal;
  regions: Region[];
}

export function GoalCard({ goal, regions }: GoalCardProps) {
  const t = useTranslations();

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
          {regions.length > 0 && (
            <div className="flex flex-col min-h-0">
              <p className="text-sm font-medium mb-2 flex-shrink-0">
                {t("goals.regionsLabel")}
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 overflow-y-auto max-h-32">
                {regions.map((region) => (
                  <li key={region.id}>{region.title}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
