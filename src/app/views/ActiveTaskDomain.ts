import { ObservableValue } from "../../lib/hex/observable_value";
import { Task } from "../models/Task";
import { ActiveTaskViewPort } from "./ActiveTask";
import { formatTime } from "../lib/formatTime";
import { TaskDetailDomain, TaskDetailDomainPort } from "./TaskDetailDomain";

export interface ActiveTaskDomainPort {
  taskDetailAdapter: TaskDetailDomainPort;
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
  taskDetailDomain = new ObservableValue<TaskDetailDomain | null>(null);
  taskDetailDelegate: TaskDetailDomainPort;

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
    this.time.setValue(formatTime(task.totalTime));

    this.taskDetailDelegate = {
      updateTask: async (task) => {
        await this.adapter.taskDetailAdapter.updateTask(task);
        this.name.setValue(task.name);
        this.link.setValue(task.link);
      },
      updateEvent: (event) => this.adapter.taskDetailAdapter.updateEvent(event),
      getEventsForTask: (task) =>
        this.adapter.taskDetailAdapter.getEventsForTask(task),
      onClose: () => this.handleCloseDetail(),
    };
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

  handleTimerStop() {
    if (!this.timerIsRunning.getValue()) {
      return;
    }
    const elapsed = Date.now() - this.startTime;
    this.task.totalTime += elapsed;
    this.timerIsRunning.setValue(false);
    this.time.setValue(formatTime(this.task.totalTime));
    this.adapter.updateTask(this.task, this.task);
    window.clearInterval(this.timerUpdateInterval);
    this.adapter.stopTimer();
  }

  handleShowDetail() {
    this.taskDetailDomain.setValue(
      new TaskDetailDomain(this.task, this.taskDetailDelegate)
    );
  }

  handleCloseDetail() {
    this.taskDetailDomain.setValue(null);
  }

  private updateTimer() {
    const elapsed = Date.now() - this.startTime;
    this.time.setValue(formatTime(this.task.totalTime + elapsed));
  }
}
