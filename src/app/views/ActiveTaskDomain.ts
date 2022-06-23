import { ObservableValue } from "../../lib/ObservableValue";
import { Task } from "../models/Task";
import { ActiveTaskViewPort } from "./ActiveTask";

export interface ActiveTaskDomainPort {
  updateTask(task: Task, newValues: Task): void;
  completeTask(task: Task): void;
  startTimer(): void;
  stopTimer(): void;
}

export class ActiveTaskDomain implements ActiveTaskViewPort {
  name = new ObservableValue<string>("");
  link = new ObservableValue<string>("");
  nameInEdit = new ObservableValue<boolean>(false);
  linkInEdit = new ObservableValue<boolean>(false);
  time = new ObservableValue<string>("00:00:00:00");
  timerIsRunning = new ObservableValue<boolean>(false);

  private task: Task;
  private adapter: ActiveTaskDomainPort;
  private startTime = 0;
  private timerUpdateInterval = -1;

  constructor(task: Task, adapter: ActiveTaskDomainPort) {
    // make a copy to avoid pollution
    this.task = { ...task };
    this.adapter = adapter;

    this.name.setValue(task.name);
    this.link.setValue(task.link);
    this.time.setValue(Task.formatTime(task.totalTime));
  }


  handleComplete() {
    this.adapter.completeTask(this.task);
  }

  handleTimerStart() {
    this.startTime = Date.now();
    this.timerIsRunning.setValue(true);
    this.adapter.startTimer();
    this.timerUpdateInterval = window.setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  private updateTimer() {
    const elapsed = Date.now() - this.startTime;
    this.time.setValue(Task.formatTime(this.task.totalTime + elapsed));
  }

  handleTimerStop() {
    if(!this.timerIsRunning.getValue()){
      return;
    }
    const elapsed = Date.now() - this.startTime;
    this.task.totalTime += elapsed;
    this.timerIsRunning.setValue(false);
    this.time.setValue(Task.formatTime(this.task.totalTime));
    this.adapter.updateTask(this.task, this.task);
    window.clearInterval(this.timerUpdateInterval);
    this.adapter.stopTimer();
  }

  handleUpdateLink: () => void;
  handleUpdateName: () => void;
  startNameEdit: () => void;
  startLinkEdit: () => void;
}
