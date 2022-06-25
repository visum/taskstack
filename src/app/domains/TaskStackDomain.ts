import { TaskRepository } from "../repositories/TaskRepository";
import { ToDoTabDomainPort } from "../views/ToDoTabDomain";
import { EventRepository } from "../repositories/EventRepository";
import { Event } from "../models/Event";
import { Task } from "../models/Task";
import { TaskPosition } from "../ports/TaskPosition";

export class TaskStackDomain implements ToDoTabDomainPort {
  taskRepository: TaskRepository;
  eventRepository: EventRepository;

  constructor(
    taskRepository: TaskRepository,
    eventRepository: EventRepository
  ) {
    this.taskRepository = taskRepository;
    this.eventRepository = eventRepository;
  }

  getTasks(): Promise<Task[]> {
    return this.taskRepository.listTasks(false);
  }

  addTask(task: Task, position: TaskPosition) {
    return this.taskRepository.addTask(task, position);
  }

  reorderTask(task: Task, direction: "up" | "down"): Promise<void> {
    const offset = direction === "up" ? -1 : 1;
    return this.taskRepository.reorderTask(task.id, offset);
  }

  activateTask(task: Task): Promise<void> {
    return this.taskRepository.moveTaskToFront(task.id);
  }

  updateTask(task: Task, newValues: Task): Promise<void> {
    return this.taskRepository.updateTask(task.id, newValues);
  }

  completeTask(task: Task): Promise<void> {
    const taskCopy = { ...task };
    taskCopy.isComplete = true;
    return this.taskRepository.updateTask(task.id, taskCopy);
  }

  addEvent(event: Event): Promise<void> {
    return this.eventRepository.addEvent(event);
  }
}
