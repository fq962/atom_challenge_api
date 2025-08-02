export interface Task {
  id: string;
  title: string;
  description: string;
  status: boolean;
  priority: number;
  created_at: Date;
  userId: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  userId: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: boolean;
  priority?: number;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  status: boolean;
  priority: number;
  created_at: string;
  userId: string;
}
