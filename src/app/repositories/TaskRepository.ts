import { Task } from "../models/Task";

export interface TaskRepository {
  listTasks(): Promise<Task[]>;
  addTask(task: Task, position: "now" | "next" | "top"): Promise<Task>;
  getTask(id: string): Promise<Task>;
  updateTask(id: string, newValues: Task): Promise<void>;
  deleteTask(id: string): Promise<void>;
  reorderTask(id: string, offset: number): Promise<void>;
  moveTaskToFront(id: string): Promise<void>;
}
