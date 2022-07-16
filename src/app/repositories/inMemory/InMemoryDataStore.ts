import { DataStore } from "../DataStore";
import { InMemoryTaskRepository } from "./InMemoryTaskRepository";
import { InMemoryEventRepository } from "./InMemoryEventRepository";
import { EventRepository } from "../EventRepository";
import { TaskRepository } from "../TaskRepository";

export class InMemoryDataStore implements DataStore {
  tasks = new InMemoryTaskRepository();
  events = new InMemoryEventRepository();

  getEventRepository(): Promise<EventRepository> {
    return Promise.resolve(this.events);
  }

  getTaskRepository(): Promise<TaskRepository> {
    return Promise.resolve(this.tasks);
  }
}
