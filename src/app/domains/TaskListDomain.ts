import { ObservableValue } from "../../lib/ObservableValue";
import { Task } from "../models/Task";
import { TaskItemViewPort } from "../views/TaskItem";
import { TaskListViewPort } from "../views/TaskList";
import { TaskItemDomain, TaskItemDomainPort } from "./TaskItemDomain";

export class TaskListDomain implements TaskListViewPort {
  tasks: ObservableValue<TaskItemViewPort[]>;

  constructor(tasks: Task[], adapter: TaskItemDomainPort) {
    const domains = tasks.map((task) => new TaskItemDomain(task, adapter));
    this.tasks.setValue(domains);
  }
}
