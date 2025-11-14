"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface WeekSelectorProps {
  selectedWeekStart: Date;
  onWeekChange: (weekStart: Date) => void;
}

/**
 * Get the start of the week (Sunday) for a given date
 * @param date - The date to find the week start for
 * @returns Date object set to Sunday at 00:00:00 UTC
 */
export function getWeekStart(date: Date): Date {
  // Work entirely in UTC to avoid timezone issues
  const d = new Date(date.getTime()); // Clone the date

  const day = d.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = day; // Days to subtract to get to Sunday

  // Set to start of day in UTC
  d.setUTCHours(0, 0, 0, 0);
  // Go back to the previous (or current) Sunday
  d.setUTCDate(d.getUTCDate() - diff);

  return d;
}

/**
 * Format a week range for display (e.g., "Nov 10 - Nov 16, 2025")
 */
function formatWeekRange(weekStart: Date): string {
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setUTCDate(end.getUTCDate() + 6); // Saturday

  const startMonth = start.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const startDay = start.getUTCDate();
  const endMonth = end.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const endDay = end.getUTCDate();
  const year = start.getUTCFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }
}

export function WeekSelector({
  selectedWeekStart,
  onWeekChange,
}: WeekSelectorProps) {
  const t = useTranslations("weeklyTasks");

  // Ensure selectedWeekStart is normalized to a Sunday
  const normalizedWeekStart = getWeekStart(selectedWeekStart);

  const handlePreviousWeek = () => {
    const prevWeek = new Date(normalizedWeekStart);
    prevWeek.setUTCDate(prevWeek.getUTCDate() - 7);
    onWeekChange(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(normalizedWeekStart);
    nextWeek.setUTCDate(nextWeek.getUTCDate() + 7);
    onWeekChange(nextWeek);
  };

  const handleThisWeek = () => {
    const today = new Date();
    const thisWeekStart = getWeekStart(today);
    onWeekChange(thisWeekStart);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePreviousWeek}
        aria-label={t("previousWeek")}
      >
        <ChevronLeft className="h-4 w-4" />
        {t("previousWeek")}
      </Button>

      <div className="flex flex-col items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleThisWeek}
          aria-label={t("thisWeek")}
        >
          {t("thisWeek")}
        </Button>
        <span className="text-sm text-muted-foreground">
          {formatWeekRange(normalizedWeekStart)}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleNextWeek}
        aria-label={t("nextWeek")}
      >
        {t("nextWeek")}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
