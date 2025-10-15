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

export interface Task {
  id: string;
  regionId: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  status: 'active' | 'completed';
  createdAt: string; // ISO date string
}
