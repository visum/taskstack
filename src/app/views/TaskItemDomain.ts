import { ObservableValue } from "../../lib/hex/observable_value";
import { Task } from "../models/Task";
import { TaskItemViewPort } from "./TaskItem";
import { formatTime } from "../lib/formatTime";

export interface TaskItemDomainPort {
  reorderTaskUp(task: Task): void;
  reorderTaskDown(task: Task): void;
  activateTask(task: Task): void;
  completeTask(task: Task): void;
}

export class TaskItemDomain implements TaskItemViewPort {
  task: Task;
  adapter: TaskItemDomainPort;
  time: ObservableValue<string>;

  constructor(task: Task, adapter: TaskItemDomainPort) {
    this.task = { ...task };
    this.adapter = adapter;
    this.time = new ObservableValue(formatTime(this.task.totalTime));
  }

  handleReorderUp() {
    this.adapter.reorderTaskUp(this.task);
  }

  handleReorderDown() {
    this.adapter.reorderTaskDown(this.task);
  }

  handleActivate() {
    this.adapter.activateTask(this.task);
  }

  handleComplete() {
    this.adapter.completeTask(this.task);
  }
}
