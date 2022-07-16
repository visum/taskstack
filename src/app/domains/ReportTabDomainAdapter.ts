import { Task } from "../models/Task";
import { Event } from "../models/Event";
import { ReportTabDomainPort } from "../views/ReportTabDomain";
import { DataStore } from "../repositories/DataStore";

export class ReportTabDomainAdapter implements ReportTabDomainPort {
  dataStore: DataStore;

  constructor(dataStore: DataStore) {
    this.dataStore = dataStore;
  }

  async getEvents(start: number, end: number): Promise<Event[]> {
    const eventRepository = await this.dataStore.getEventRepository();
    return eventRepository.getEventsForRange(start, end);
  }

  async getTasks(): Promise<Task[]> {
    const taskRepository = await this.dataStore.getTaskRepository();
    return taskRepository.listTasks(true);
  }
}
