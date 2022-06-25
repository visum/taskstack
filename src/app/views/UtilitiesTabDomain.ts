import { UtilitiesTabPort } from "./UtilitiesTab";
import { TaskRepository } from "../repositories/TaskRepository";
import { EventRepository } from "../repositories/EventRepository";

export interface UtilitiesTabDomainPort {
  taskRepository: TaskRepository;
  eventRepository: EventRepository;
}

export class UtiliesTabDomain implements UtilitiesTabPort {
  taskRepository: TaskRepository;
  eventRepository: EventRepository;

  constructor(
    taskRepository: TaskRepository,
    eventRepository: EventRepository
  ) {
    this.taskRepository = taskRepository;
    this.eventRepository = eventRepository;
  }

  clearData(): Promise<void> {
    return Promise.all([
      this.taskRepository.empty(),
      this.eventRepository.empty(),
    ]).then();
  }
}
