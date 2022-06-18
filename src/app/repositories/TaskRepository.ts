import { Task } from "../models/Task";

export interface TaskRepository {
  listTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task>;
  updateTask(id: string, newValues: Task): Promise<void>;
  deleteTask(id: string): Promise<void>;
}
