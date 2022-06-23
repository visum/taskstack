import { ActiveTaskViewPort } from "./ActiveTask";
import { TaskFormViewPort } from "./TaskForm";
import { TaskListViewPort } from "./TaskList";
import { ToDoTabViewPort } from "./ToDoTab";
import { TaskListDomain } from "./TaskListDomain";
import { ActiveTaskDomain, ActiveTaskDomainPort } from "./ActiveTaskDomain";
import { TaskFormDomain, TaskFormDomainPort } from "./TaskFormDomain";
import { TaskItemDomainPort } from "./TaskItemDomain";

import { TaskPosition } from "../ports/TaskPosition";
import { Task } from "../models/Task";
import { Event, EventType } from "../models/Event";
import { ObservableValue } from "../../lib/ObservableValue";

export interface ToDoTabDomainPort {
  getTasks(): Promise<Task[]>;
  addTask(task: Task, position: TaskPosition): Promise<Task>;
  reorderTask(task: Task, direction: "up" | "down"): Promise<void>;
  activateTask(task: Task): Promise<void>;
  updateTask(task: Task, newValues: Task): Promise<void>;
  completeTask(task: Task): Promise<void>;
  addEvent(event: Event): Promise<void>;
}

export class ToDoTabDomain
  implements
    ToDoTabViewPort,
    ActiveTaskDomainPort,
    TaskFormDomainPort,
    TaskItemDomainPort
{
  adapter: ToDoTabDomainPort;
  // taskListDomain: ObservableValue<TaskListViewPort>;
  taskListDomain: TaskListViewPort;
  activeTaskDomain = new ObservableValue<ActiveTaskViewPort | null>(null);
  taskFormDomain = new ObservableValue<TaskFormViewPort | null>(null);
  activeTask: Task | null = null;

  constructor(adapter: ToDoTabDomainPort) {
    this.adapter = adapter;
    this.taskListDomain = new TaskListDomain([], this);
    this.taskFormDomain.setValue(new TaskFormDomain(this));
    this.updateTaskList();
  }

  private async updateTaskList() {
    const tasks = [...(await this.adapter.getTasks())];
    const activeItem = tasks.shift();
    if (activeItem) {
      if (this.activeTask?.id !== activeItem.id) {
        const activeTaskDomain = this.activeTaskDomain.getValue();
        const event: Event = {
          type: EventType.SWITCH,
          time: Date.now(),
          taskId: activeItem.id,
        };
        this.adapter.addEvent(event);
        if (activeTaskDomain) {
          activeTaskDomain.handleTimerStop();
        }
        this.activeTask = activeItem;
        this.activeTaskDomain.setValue(new ActiveTaskDomain(activeItem, this));
      }
    }
    this.taskListDomain.updateList(tasks);
  }

  // ActiveTaskDomainPort
  updateTask(task: Task, newValues: Task): void {
    this.adapter.updateTask(task, newValues).then(() => {
      this.updateTaskList();
    });
  }

  completeTask(task: Task) {
    this.adapter.completeTask(task).then(() => {
      this.updateTaskList();
    });
  }

  startTimer(): void {
    if (!this.activeTask) {
      return;
    }
    const event: Event = {
      type: EventType.START,
      time: Date.now(),
      taskId: this.activeTask.id,
    };
    this.adapter.addEvent(event);
  }

  stopTimer(): void {
    if (!this.activeTask) {
      return;
    }
    const event: Event = {
      type: EventType.STOP,
      time: Date.now(),
      taskId: this.activeTask.id,
    };
    this.adapter.addEvent(event);
  }

  // TaskItemDomainPort
  reorderTaskUp(task: Task): void {
    this.adapter.reorderTask(task, "up").then(() => {
      this.updateTaskList();
    });
  }

  reorderTaskDown(task: Task): void {
    this.adapter.reorderTask(task, "down").then(() => {
      this.updateTaskList();
    });
  }

  activateTask(task: Task): void {
    this.adapter.activateTask(task).then(() => {
      this.updateTaskList();
    });
  }

  // TaskFormDomainPort
  addTask(task: Task, position: "last" | "next" | "now"): void {
    this.adapter.addTask(task, position).then(() => {
      this.updateTaskList();
    });
  }
}
