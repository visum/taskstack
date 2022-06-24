import { Task } from "../../models/Task";
import { TaskPosition } from "../../ports/TaskPosition";
import { TaskRepository } from "../TaskRepository";

export class LocalStorageTaskRepository implements TaskRepository {
  private tasks: Task[] = [];
  private storageKeyPrefix: string;
  private idCounter: number = 0;

  constructor(storageKeyPrefix = "TS") {
    if (!window.localStorage) {
      throw new Error("LocalStorage is not supported in this environment");
    }
    this.storageKeyPrefix = storageKeyPrefix;
    this.load();
  }

  private getStorageKey() {
    return `${this.storageKeyPrefix}-tasks`;
  }

  private load() {
    const payload = window.localStorage.getItem(this.getStorageKey());
    if (!payload) {
      this.tasks = [];
    } else {
      this.tasks = JSON.parse(payload);
    }

    const idCounterString = window.localStorage.getItem(
      this.getStorageKey() + "_id"
    );
    if (idCounterString) {
      this.idCounter = parseInt(idCounterString, 10);
    } else {
      this.idCounter = 0;
    }
  }

  private save() {
    const payload = JSON.stringify(this.tasks);
    window.localStorage.setItem(this.getStorageKey(), payload);
    window.localStorage.setItem(
      this.getStorageKey() + "_id",
      String(this.idCounter)
    );
  }

  listTasks(): Promise<Task[]> {
    return Promise.resolve(this.tasks);
  }

  addTask(task: Task, position: TaskPosition): Promise<Task> {
    const taskCopy = { ...task };
    taskCopy.id = `${this.idCounter++}`;
    if (position === "next") {
      this.tasks.splice(1, 0, taskCopy);
    } else if (position === "now") {
      this.tasks.unshift(taskCopy);
    } else if (position === "last") {
      this.tasks.push(taskCopy);
    }
    this.save();
    return Promise.resolve(taskCopy);
  }

  getTask(id: string): Promise<Task> {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      return Promise.resolve(task);
    }
    return Promise.reject(`Task ${id} not found`);
  }

  updateTask(id: string, newValues: Task): Promise<void> {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      return Promise.reject(`Task ${id} not found`);
    }
    newValues.id = id;
    this.tasks[index] = newValues;
    this.save();
    return Promise.resolve();
  }

  deleteTask(id: string): Promise<void> {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      return Promise.reject(`Task ${id} not found`);
    }
    this.tasks.splice(index, 1);
    this.save();
    return Promise.resolve();
  }

  reorderTask(id: string, offset: number) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      return Promise.reject(`Task ${id} not found`);
    }
    const [task] = this.tasks.splice(index, 1);

    this.tasks.splice(index + offset, 0, task);
    this.save();
    return Promise.resolve();
  }

  moveTaskToFront(id: string) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      return Promise.reject(`Task ${id} not found`);
    }
    const [task] = this.tasks.splice(index, 1);
    this.tasks.unshift(task);
    this.save();
    return Promise.resolve();
  }
}
