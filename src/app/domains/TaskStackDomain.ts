import { ToDoTabDomainPort } from "../views/ToDoTabDomain";
import { DataStore } from "../repositories/DataStore";
import { Event } from "../models/Event";
import { Task } from "../models/Task";
import { TaskPosition } from "../ports/TaskPosition";

export class TaskStackDomain implements ToDoTabDomainPort {
  dataStore: DataStore;

  constructor(dataStore: DataStore) {
    this.dataStore = dataStore;
  }

  async getTasks(): Promise<Task[]> {
    const taskRepository = await this.dataStore.getTaskRepository();
    return taskRepository.listTasks(false);
  }

  async addTask(task: Task, position: TaskPosition) {
    const taskRepository = await this.dataStore.getTaskRepository();
    return taskRepository.addTask(task, position);
  }

  async reorderTask(task: Task, direction: "up" | "down"): Promise<void> {
    const taskRepository = await this.dataStore.getTaskRepository();
    const offset = direction === "up" ? -1 : 1;
    return taskRepository.reorderTask(task.id, offset);
  }

  async activateTask(task: Task): Promise<void> {
    const taskRepository = await this.dataStore.getTaskRepository();
    return taskRepository.moveTaskToFront(task.id);
  }

  async updateTask(task: Task, newValues: Task): Promise<void> {
    const taskRepository = await this.dataStore.getTaskRepository();
    return taskRepository.updateTask(task.id, newValues);
  }

  async completeTask(task: Task): Promise<void> {
    const taskCopy = { ...task };
    taskCopy.isComplete = true;
    const taskRepository = await this.dataStore.getTaskRepository();
    return taskRepository.updateTask(task.id, taskCopy);
  }

  async addEvent(event: Event): Promise<void> {
    const eventRepository = await this.dataStore.getEventRepository();
    return eventRepository.addEvent(event);
  }
}
