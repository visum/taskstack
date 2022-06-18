import { ActiveTaskViewPort } from "../views/ActiveTask";
import { TaskFormViewPort } from "../views/TaskForm";
import { TaskListViewPort } from "../views/TaskList";
import { ToDoTabViewPort } from "../views/ToDoTab";
import { TaskItemDomainPort } from "./TaskItemDomain";

import { TaskListDomain } from "./TaskListDomain";
import { ActiveTaskDomain, ActiveTaskDomainPort } from "./ActiveTaskDomain";

import { Task } from "../models/Task";
import { ObservableValue } from "../../lib/ObservableValue";

export interface ToDoTabDomainPort {
  getTasks(): Promise<Task[]>;
  addTask(task: Task, position: "top" | "next" | "now");
  reorderTask(task: Task, direction: "up" | "down"): Promise<void>;
  activateTask(task: Task): Promise<void>;
}

export class ToDoTabDomain
  implements ToDoTabViewPort, TaskItemDomainPort, ActiveTaskDomainPort {
  adapter: ToDoTabDomainPort;
  taskListDomain: ObservableValue<TaskListViewPort>;
  activeTaskDomain = new ObservableValue<ActiveTaskViewPort | null>(null);
  taskFormDomain = new ObservableValue<TaskFormViewPort | null>(null);

  constructor(adapter: ToDoTabDomainPort) {
    this.adapter = adapter;
    this.taskListDomain = new ObservableValue(new TaskListDomain([], this));
  }

  private async init() {
    const tasks = await this.adapter.getTasks();
  }

  // ActiveTaskDomainPort
  updateTask(task: Task, newValues: Task): void {
    throw new Error("Method not implemented.");
  }
  completeTask(task: Task) {
    throw new Error("Method not implemented.");
  }
  startTimer(): void {
    throw new Error("Method not implemented.");
  }

  // TaskItemDomainPort
  reorderTaskUp(task: Task): void {
    this.adapter.reorderTask(task, "up");
  }
  reorderTaskDown(task: Task): void {
    this.adapter.reorderTask(task, "down");
  }
  activateTask(task: Task): void {
    this.adapter.activateTask(task);
  }
}
