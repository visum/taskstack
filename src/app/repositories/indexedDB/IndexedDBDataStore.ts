import { DataStore } from "../DataStore";
import { EventRepository } from "../EventRepository";
import { IndexedDBEventRepository } from "./IndexedDBEventRepository";
import { IndexedDBTaskRepository } from "./IndexedDBTaskRepository";
import { TaskRepository } from "../TaskRepository";
import { IndexedDBClient } from "./IndexedDBClient";

export class IndexedDBDataStore implements DataStore {
  dbClient: IndexedDBClient;
  eventRepository: EventRepository;
  taskRepository: TaskRepository;

  constructor(dbName?: string) {
    this.dbClient = new IndexedDBClient(dbName);
    this.eventRepository = new IndexedDBEventRepository(this.dbClient);
    this.taskRepository = new IndexedDBTaskRepository(this.dbClient);
  }

  initialize(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getEventRepository(): Promise<EventRepository> {
    return Promise.resolve(this.eventRepository);
  }

  getTaskRepository(): Promise<TaskRepository> {
    return Promise.resolve(this.taskRepository);
  }
}
