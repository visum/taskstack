import { DataStore } from "../DataStore";
import { EventRepository } from "../EventRepository";
import { TaskRepository } from "../TaskRepository";
import { LocalStorageEventRepository } from "./LocalStorageEventRepository";
import { LocalStorageTaskRepository } from "./LocalStorageTaskRepository";

export class LocalStorageDataStore implements DataStore {
  events: LocalStorageEventRepository;
  tasks: LocalStorageTaskRepository;

  constructor(keyPrefix?: string) {
    this.events = new LocalStorageEventRepository(keyPrefix);
    this.tasks = new LocalStorageTaskRepository(keyPrefix);
  }

  getEventRepository(): Promise<EventRepository> {
    return Promise.resolve(this.events);
  }

  getTaskRepository(): Promise<TaskRepository> {
    return Promise.resolve(this.tasks);
  }
}
