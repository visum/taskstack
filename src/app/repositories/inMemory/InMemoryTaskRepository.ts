import { Task } from "../../models/Task";
import { TaskRepository } from "../TaskRepository";
import { TaskPosition } from "../../ports/TaskPosition";

export class InMemoryTaskRepository implements TaskRepository {
  tasks: Task[] = [];
  private idCounter = 0;

  listTasks(): Promise<Task[]> {
    return Promise.resolve(this.tasks);
  }

  addTask(task: Task, position: TaskPosition) {
    const taskCopy = { ...task };
    taskCopy.id = `${this.idCounter++}`;
    if (position === "next") {
      this.tasks.splice(1, 0, taskCopy);
    } else if (position === "now") {
      this.tasks.unshift(taskCopy);
    } else if (position === "last") {
      this.tasks.push(taskCopy);
    }
    return Promise.resolve(taskCopy);
  }

  getTask(id: string): Promise<Task> {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      return Promise.resolve(task);
    }
    return Promise.reject(`Task ${id} not found`);
  }

  async updateTask(id: string, newValues: Task): Promise<void> {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      return Promise.reject(`Task ${id} not found`);
    }
    newValues.id = id;
    this.tasks[index] = newValues;
    return Promise.resolve();
  }

  deleteTask(id: string): Promise<void> {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      return Promise.reject(`Task ${id} not found`);
    }
    this.tasks.splice(index, 1);
    return Promise.resolve();
  }

  reorderTask(id: string, offset: number) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      return Promise.reject(`Task ${id} not found`);
    }
    const [task] = this.tasks.splice(index, 1);

    this.tasks.splice(index + offset, 0, task);
    return Promise.resolve();
  }

  moveTaskToFront(id: string) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      return Promise.reject(`Task ${id} not found`);
    }
    const [task] = this.tasks.splice(index, 1);
    this.tasks.unshift(task);
    return Promise.resolve();
  }
}
