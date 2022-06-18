import { Task } from "../models/Task";
import { TaskItemViewPort } from "../views/TaskItem";

export interface TaskItemDomainPort {
  reorderTaskUp(task: Task): void;
  reorderTaskDown(task: Task): void;
  activeTask(task: Task): void;
}

export class TaskItemDomain implements TaskItemViewPort {
  task: Task;
  adapter: TaskItemDomainPort;

  constructor(task: Task, adapter: TaskItemDomainPort) {
    this.task = { ...task };
    this.adapter = adapter;
  }

  handleReorderUp() {
    this.adapter.reorderTaskUp(this.task);
  }

  handleReorderDown() {
    this.adapter.reorderTaskDown(this.task);
  }

  handleActivate() {
    this.adapter.activeTask(this.task);
  }
}
