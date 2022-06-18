import { ObservableValue } from "../../lib/ObservableValue";
import { Task } from "../models/Task";
import { Event } from "../models/Event";

export class TaskStackDomain {
  tasks = new ObservableValue<Task[]>([]);
  timerIsRunning = new ObservableValue<boolean>(false);

  events: Event[] = [];

  pushTask(task: Task) {
    const taskList = this.tasks.getValue();
    taskList.push(task);
    this.tasks.setValue(taskList);
  }

  addTaskToTop(task: Task) {
    const taskList = this.tasks.getValue();
    taskList.unshift(task);
    this.tasks.setValue(taskList);
  }
}
