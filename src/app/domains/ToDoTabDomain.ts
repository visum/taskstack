import { ActiveTaskViewPort } from "../views/ActiveTask";
import { TaskFormViewPort } from "../views/TaskForm";
import { TaskListViewPort } from "../views/TaskList";
import { ToDoTabViewPort } from "../views/ToDoTab";
import { Task } from "../models/Task";

export interface ToDoTabDomainPort {
  tasks: Task[];
  addTask(task: Task, position: "top" | "next" | "now");
}

export class ToDoTabDomain implements ToDoTabViewPort {
  adapter: ToDoTabDomainPort;

  constructor(adapter: ToDoTabDomainPort) {
    this.adapter = adapter;
  }

  taskListDomain: TaskListViewPort;
  activeTaskDomain: ActiveTaskViewPort;
  taskFormDomain: TaskFormViewPort;
}
