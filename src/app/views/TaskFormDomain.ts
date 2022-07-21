import { ObservableValue } from "../../lib/hex/observable_value";
import { TaskFormViewPort } from "./TaskForm";
import { Task } from "../models/Task";
import { TaskPosition } from "../ports/TaskPosition";

export interface TaskFormDomainPort {
  addTask(task: Task, position: TaskPosition): void;
}

export class TaskFormDomain implements TaskFormViewPort {
  private adapter: TaskFormDomainPort;
  private containerRef: HTMLDivElement | null = null;

  name: ObservableValue<string> = new ObservableValue("");
  link: ObservableValue<string> = new ObservableValue("");
  isValid: ObservableValue<boolean> = new ObservableValue(false);

  constructor(adapter: TaskFormDomainPort) {
    this.adapter = adapter;
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleNameChange(value: string) {
    this.isValid.setValue(value !== "");
    this.name.setValue(value);
  }

  handleLinkChange(value: string) {
    this.link.setValue(value);
  }

  handleAdd(position: "last" | "next" | "now") {
    const task: Task = {
      id: "",
      name: this.name.getValue(),
      link: this.link.getValue(),
      totalTime: 0,
      isComplete: false,
    };
    this.adapter.addTask(task, position);
    this.isValid.setValue(false);
    this.name.setValue("");
    this.link.setValue("");
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      if (event.ctrlKey) {
        this.handleAdd("now");
      } else if (event.shiftKey) {
        this.handleAdd("next");
      } else {
        this.handleAdd("last");
      }
    }
  }

  setRef(element: HTMLDivElement | null) {
    if (this.containerRef) {
      this.containerRef.removeEventListener("keypress", this.handleKeyPress);
    }
    if (element) {
      this.containerRef = element;
      element.addEventListener("keypress", this.handleKeyPress);
    }
  }
}
