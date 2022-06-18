import { ObservableValue } from "../../lib/ObservableValue";
import { Task } from "../models/Task";
import { ActiveTaskViewPort } from "../views/ActiveTask";

const SECONDS_IN_DAY = 86400;
const SECONDS_IN_HOUR = 3600;

export interface ActiveTaskDomainPort {
  updateTask(task: Task, newValues: Task): void;
  completeTask(task: Task);
  startTimer(): void;
  tasks: Task[];
  events: Event[];
}

export class ActiveTaskDomain implements ActiveTaskViewPort {
  name = new ObservableValue<string>("");
  link = new ObservableValue<string>("");
  nameInEdit = new ObservableValue<boolean>(false);
  linkInEdit = new ObservableValue<boolean>(false);
  time = new ObservableValue<string>("00:00:00:00");
  timerIsRunning = new ObservableValue<boolean>(false);

  task: Task;
  adapter: ActiveTaskPort;
  startTime = 0;

  constructor(task: Task, adapter: ActiveTaskPort) {
    // make a copy to avoid pollution
    this.task = { ...task };
    this.adapter = adapter;

    this.name.setValue(task.name);
    this.link.setValue(task.link);
    this.time.setValue(this.formatTime());
  }

  private formatTime() {
    const time = Math.floor(this.task.totalTime / 1000);

    const days = Math.floor(time / SECONDS_IN_DAY);
    const secondsAfterDays = time - days * SECONDS_IN_DAY;
    const hours = Math.floor(secondsAfterDays / SECONDS_IN_HOUR);
    const secondsAfterHours = secondsAfterDays - hours * SECONDS_IN_HOUR;
    const minutes = Math.floor(secondsAfterHours / 60);
    const secondsAfterMinutes = minutes - minutes * 60;

    return `${this.padStart(days, 2, "0")}:${this.padStart(
      hours,
      2,
      "0"
    )}:${this.padStart(minutes, 2, "0")}:${this.padStart(
      secondsAfterMinutes,
      2,
      "0"
    )}`;
  }

  private padStart(input: number, length: number, char: string = "0") {
    const s = String(input);
    const diff = length - s.length;
    if (diff > 0) {
      const pad = new Array(diff).fill(char).join("");
      return pad + s;
    }
    return s;
  }

  handleComplete() {
    this.adapter.completeTask(this.task);
  }

  handleTimerStart() {
    this.startTime = Date.now();
    this.timerIsRunning.setValue(true);
    this.adapter.startTimer();
  }

  handleTimerStop() {
    const elapsed = Date.now() - this.startTime;
    this.task.totalTime += elapsed;
    this.timerIsRunning.setValue(false);
    this.adapter.updateTask(this.task, this.task);
    this.time.setValue(this.formatTime());
  }

  handleUpdateLink: () => void;
  handleUpdateName: () => void;
  startNameEdit: () => void;
  startLinkEdit: () => void;
}
