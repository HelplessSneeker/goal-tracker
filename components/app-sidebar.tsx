"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Goal, Region } from "@/lib/types";
import { ChevronRight, Target, ChevronsDownUp, TrendingUp } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";
import { getGoalsAction } from "@/app/actions/goals";
import { getRegionsAction } from "@/app/actions/regions";
import { UserMenu } from "@/components/user-menu";

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [openGoals, setOpenGoals] = useState<Set<string>>(new Set());

  const [isGoalsOpen, setIsGoalsOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [goalsResult, regionsResult] = await Promise.all([
          getGoalsAction(),
          getRegionsAction(),
        ]);

        if ("success" in goalsResult && goalsResult.success) {
          setGoals(goalsResult.data);
        }

        if ("success" in regionsResult && regionsResult.success) {
          setRegions(regionsResult.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  // Auto-expand Goals section and individual goals based on current route
  useEffect(() => {
    if (pathname.startsWith("/goals")) {
      setIsGoalsOpen(true);

      // If on a region page, open that goal
      const pathParts = pathname.split("/");
      if (pathParts.length >= 4 && pathParts[1] === "goals") {
        const goalId = pathParts[2];
        setOpenGoals((prev) => new Set(prev).add(goalId));
      }

      // If on a goal detail page, open that goal
      if (pathParts.length === 3 && pathParts[1] === "goals") {
        const goalId = pathParts[2];
        setOpenGoals((prev) => new Set(prev).add(goalId));
      }
    }
  }, [pathname]);

  const toggleGoalsSection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsGoalsOpen((prev) => !prev);
  };

  const toggleGoal = (goalId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenGoals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(goalId)) {
        newSet.delete(goalId);
      } else {
        newSet.add(goalId);
      }
      return newSet;
    });
  };

  const getRegionsForGoal = (goalId: string) => {
    return regions.filter((region) => region.goalId === goalId);
  };

  const collapseAll = () => {
    setIsGoalsOpen(false);
    setOpenGoals(new Set());
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            <SidebarTrigger />
            <button
              onClick={collapseAll}
              className="size-7 p-1 hover:bg-sidebar-accent rounded-md cursor-pointer flex items-center justify-center group-data-[collapsible=icon]:hidden"
              title={t("navigation.collapseAll")}
            >
              <ChevronsDownUp className="size-4" />
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("navigation.sidebar")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/progress"}
                  tooltip={t("navigation.progress")}
                >
                  <Link href="/progress">
                    <TrendingUp />
                    <span>{t("navigation.progress")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible
                open={isGoalsOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <div className="relative flex items-center">
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith("/goals")}
                      tooltip={t("navigation.goals")}
                      className="cursor-pointer flex-1"
                    >
                      <Link href="/goals">
                        <Target />
                        <span>{t("navigation.goals")}</span>
                      </Link>
                    </SidebarMenuButton>
                    <button
                      onClick={toggleGoalsSection}
                      className="absolute right-2 p-1 hover:bg-sidebar-accent rounded-sm cursor-pointer"
                    >
                      <ChevronRight className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </button>
                  </div>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {goals.length > 0 &&
                        goals.map((goal) => {
                          const goalRegions = getRegionsForGoal(goal.id);
                          const isGoalOpen = openGoals.has(goal.id);
                          const hasRegions = goalRegions.length > 0;

                          return (
                            <Collapsible
                              key={goal.id}
                              open={isGoalOpen}
                              className="group/goal"
                            >
                              <SidebarMenuSubItem>
                                <div className="relative flex items-center">
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === `/goals/${goal.id}`}
                                    className="cursor-pointer flex-1"
                                  >
                                    <Link href={`/goals/${goal.id}`}>
                                      <span>{goal.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                  {hasRegions && (
                                    <button
                                      onClick={(e) => toggleGoal(goal.id, e)}
                                      className="absolute right-2 p-1 hover:bg-sidebar-accent rounded-sm cursor-pointer"
                                    >
                                      <ChevronRight className="size-4 transition-transform group-data-[state=open]/goal:rotate-90" />
                                    </button>
                                  )}
                                </div>
                                {hasRegions && (
                                  <CollapsibleContent>
                                    <SidebarMenuSub>
                                      {goalRegions.map((region) => (
                                        <SidebarMenuSubItem key={region.id}>
                                          <SidebarMenuSubButton
                                            asChild
                                            isActive={
                                              pathname ===
                                              `/goals/${goal.id}/${region.id}`
                                            }
                                          >
                                            <Link
                                              href={`/goals/${goal.id}/${region.id}`}
                                            >
                                              <span>{region.title}</span>
                                            </Link>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      ))}
                                    </SidebarMenuSub>
                                  </CollapsibleContent>
                                )}
                              </SidebarMenuSubItem>
                            </Collapsible>
                          );
                        })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
