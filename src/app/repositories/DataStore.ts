import { EventRepository } from "./EventRepository";
import { TaskRepository } from "./TaskRepository";

export interface DataStore {
  getEventRepository(): Promise<EventRepository>;
  getTaskRepository(): Promise<TaskRepository>;
}
