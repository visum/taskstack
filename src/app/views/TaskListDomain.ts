import { ObservableValue } from "../../lib/hex/observable_value";
import { Task } from "../models/Task";
import { TaskItemViewPort } from "./TaskItem";
import { TaskListViewPort } from "./TaskList";
import { TaskItemDomain, TaskItemDomainPort } from "./TaskItemDomain";

export class TaskListDomain implements TaskListViewPort {
  tasks = new ObservableValue<TaskItemViewPort[]>([]);
  adapter: TaskItemDomainPort;

  constructor(tasks: Task[], adapter: TaskItemDomainPort) {
    this.adapter = adapter;
    this.updateList(tasks);
  }

  updateList(tasks: Task[]) {
    const domains = tasks.map((task) => new TaskItemDomain(task, this.adapter));
    this.tasks.setValue(domains);
  }
}
