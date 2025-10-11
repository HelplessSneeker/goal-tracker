export interface Goal {
  id: string;
  title: string;
  description: string;
}

export interface Region {
  id: string;
  goalId: string;
  title: string;
  description: string;
}
