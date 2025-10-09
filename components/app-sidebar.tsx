"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Goal } from "@/lib/types";
import { ChevronRight, Target } from "lucide-react";
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
  const [isGoalsOpen, setIsGoalsOpen] = useState(true);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const res = await fetch("/api/goals", {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setGoals(data);
        }
      } catch (error) {
        console.error("Failed to fetch goals:", error);
      }
    }
    fetchGoals();
  }, []);

  const handleGoalsClick = () => {
    if (state === "collapsed") {
      router.push("/goals");
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                open={isGoalsOpen}
                onOpenChange={setIsGoalsOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={pathname.startsWith("/goals")}
                      onClick={handleGoalsClick}
                      tooltip="Goals"
                    >
                      <Target />
                      <span>Goals</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === "/goals"}
                        >
                          <Link href="/goals">
                            <span>Overview</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      {goals.length > 0 &&
                        goals.map((goal) => (
                          <SidebarMenuSubItem key={goal.id}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === `/goals/${goal.id}`}
                            >
                              <Link href={`/goals/${goal.id}`}>
                                <span>{goal.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
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
