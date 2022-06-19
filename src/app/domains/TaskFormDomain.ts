import { ObservableValue } from "../../lib/ObservableValue";
import { TaskFormViewPort } from "../views/TaskForm";
import { Task } from "../models/Task";

export interface TaskFormDomainPort {
  addTask(task: Task, position: "top" | "next" | "now"): void;
}

export class TaskFormDomain implements TaskFormViewPort {
  adapter: TaskFormDomainPort;

  name: ObservableValue<string> = new ObservableValue("");
  link: ObservableValue<string> = new ObservableValue("");

  constructor(adapter: TaskFormDomainPort) {
    this.adapter = adapter;
  }

  handleNameChange(value: string) {
    this.name.setValue(value);
  }

  handleLinkChange(value: string) {
    this.link.setValue(value);
  }

  handleAdd(position: "top" | "next" | "now") {
    const task: Task = {
      id: "",
      name: this.name.getValue(),
      link: this.link.getValue(),
      totalTime: 0,
      isComplete: false
    };
    this.adapter.addTask(task, position);
    this.name.setValue("");
    this.link.setValue("");
  }
}
