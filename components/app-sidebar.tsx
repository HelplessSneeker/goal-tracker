"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Goal, Subgoal } from "@/lib/types";
import { ChevronRight, Target, ChevronsDownUp, TrendingUp } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [subgoals, setSubgoals] = useState<Subgoal[]>([]);
  const [openGoals, setOpenGoals] = useState<Set<string>>(new Set());

  const [isGoalsOpen, setIsGoalsOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [goalsRes, subgoalsRes] = await Promise.all([
          fetch("/api/goals", { cache: "no-store" }),
          fetch("/api/subgoals", { cache: "no-store" }),
        ]);

        if (goalsRes.ok) {
          const goalsData = await goalsRes.json();
          setGoals(goalsData);
        }

        if (subgoalsRes.ok) {
          const subgoalsData = await subgoalsRes.json();
          setSubgoals(subgoalsData);
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

      // If on a subgoal page, open that goal
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

  const getSubgoalsForGoal = (goalId: string) => {
    return subgoals.filter((subgoal) => subgoal.goalId === goalId);
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
              title="Collapse all"
            >
              <ChevronsDownUp className="size-4" />
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/progress"}
                  tooltip="Progress"
                >
                  <Link href="/progress">
                    <TrendingUp />
                    <span>Progress</span>
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
                      tooltip="Goals"
                      className="cursor-pointer flex-1"
                    >
                      <Link href="/goals">
                        <Target />
                        <span>Goals</span>
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
                          const goalSubgoals = getSubgoalsForGoal(goal.id);
                          const isGoalOpen = openGoals.has(goal.id);
                          const hasSubgoals = goalSubgoals.length > 0;

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
                                  {hasSubgoals && (
                                    <button
                                      onClick={(e) => toggleGoal(goal.id, e)}
                                      className="absolute right-2 p-1 hover:bg-sidebar-accent rounded-sm cursor-pointer"
                                    >
                                      <ChevronRight className="size-4 transition-transform group-data-[state=open]/goal:rotate-90" />
                                    </button>
                                  )}
                                </div>
                                {hasSubgoals && (
                                  <CollapsibleContent>
                                    <SidebarMenuSub>
                                      {goalSubgoals.map((subgoal) => (
                                        <SidebarMenuSubItem key={subgoal.id}>
                                          <SidebarMenuSubButton
                                            asChild
                                            isActive={
                                              pathname ===
                                              `/goals/${goal.id}/${subgoal.id}`
                                            }
                                          >
                                            <Link
                                              href={`/goals/${goal.id}/${subgoal.id}`}
                                            >
                                              <span>{subgoal.title}</span>
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
    </Sidebar>
  );
}
