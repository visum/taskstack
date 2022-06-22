import { ObservableValue } from "../../lib/ObservableValue";
import { Task } from "../models/Task";
import { TaskItemViewPort } from "../views/TaskItem";
import { TaskListViewPort } from "../views/TaskList";
import { TaskItemDomain, TaskItemDomainPort } from "./TaskItemDomain";

export class TaskListDomain implements TaskListViewPort {
  tasks = new ObservableValue<TaskItemViewPort[]>([]);
  adapter: TaskItemDomainPort;

  constructor(tasks: Task[], adapter: TaskItemDomainPort) {
    this.adapter = adapter;
    this.updateList(tasks);
  }

  updateList(tasks: Task[]) {
    const adapter = this.adapter;
    const domains = tasks.map((task) => new TaskItemDomain(task, adapter)).reverse();
    this.tasks.setValue(domains);
  }
}
