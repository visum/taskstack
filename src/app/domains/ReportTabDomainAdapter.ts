import { Task } from "../models/Task";
import { Event } from "../models/Event";
import { ReportTabDomainPort } from "../views/ReportTabDomain";
import { EventRepository } from "../repositories/EventRepository";
import { TaskRepository } from "../repositories/TaskRepository";

export class ReportTabDomainAdapter implements ReportTabDomainPort {
  eventRepository: EventRepository;
  taskRepository: TaskRepository;

  constructor(
    taskRepository: TaskRepository,
    eventRepository: EventRepository
  ) {
    this.eventRepository = eventRepository;
    this.taskRepository = taskRepository;
  }

  getEvents(): Promise<Event[]> {
    return this.eventRepository.listEvents();
  }

  getTasks(): Promise<Task[]> {
    return this.taskRepository.listTasks();
  }
}