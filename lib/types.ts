export interface Goal {
  id: string;
  title: string;
  description: string;
}

export interface Subgoal {
  id: string;
  goalId: string;
  title: string;
  description: string;
}
