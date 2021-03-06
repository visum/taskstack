import { ObservableValue } from "../../lib/hex/observable_value";
import { Task } from "../models/Task";
import { Event, EventType } from "../models/Event";
import { ReportTabViewPort, TaskInterval, TaskTotalRecord } from "./ReportTab";
import { Day } from "../ports/Day";

export interface ReportTabDomainPort {
  getTasks: () => Promise<Task[]>;
  getEvents: (start: number, end: number) => Promise<Event[]>;
}

const MS_IN_DAY = 86_400_000;

export class ReportTabDomain implements ReportTabViewPort {
  totalTasks: ObservableValue<number> = new ObservableValue(0);
  totalTime: ObservableValue<number> = new ObservableValue(0);
  totalChanges: ObservableValue<number> = new ObservableValue(0);
  taskTotals: ObservableValue<TaskTotalRecord> = new ObservableValue({});
  day: ObservableValue<Day>;
  intervals = new ObservableValue<TaskInterval[]>([]);

  private adapter: ReportTabDomainPort;

  constructor(adapter: ReportTabDomainPort) {
    this.adapter = adapter;
    this.day = new ObservableValue(this.getToday());

    this.day.onChange(() => {
      this.update();
    });

    this.update();
  }

  private changeDay(days: number) {
    const day = this.day.getValue();
    const date = this.dayToDate(day);
    date.setDate(date.getDate() + days);
    const newDay = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    this.day.setValue(newDay);
  }

  update() {
    const reportDay = this.day.getValue();
    const startTimestamp = this.dayToTimestamp(reportDay);
    const endTimesatmp = startTimestamp + MS_IN_DAY;

    Promise.all([
      this.adapter.getEvents(startTimestamp, endTimesatmp),
      this.adapter.getTasks(),
    ]).then(([events, tasks]) => this.generateReport(events, tasks));
  }

  handleSelectNextDay() {
    this.changeDay(1);
  }

  handleSelectToday(): void {
    this.day.setValue(this.getToday());
  }

  handleSelectPreviousDay(): void {
    this.changeDay(-1);
  }

  private getToday(): Day {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  }

  private dayToTimestamp(day: Day) {
    return this.dayToDate(day).getTime();
  }

  private dayToDate(day: Day) {
    return new Date(day.year, day.month - 1, day.day);
  }

  private generateReport(events: Event[], tasks: Task[]) {
    const eventIds: string[] = [];

    const workedTasks = events.reduce<TaskTotalRecord>((accumulator, event) => {
      if (!eventIds.includes(event.taskId)) {
        eventIds.push(event.taskId);
        const task = tasks.find((t) => t.id === event.taskId);
        if (task) {
          accumulator[task.id] = { task: task, total: 0 };
        }
        return accumulator;
      }
      return accumulator;
    }, {});

    // TODO: there are some optimization opportunities here
    const tasksById: Record<string, Task> = {};
    tasks.forEach((task) => {
      tasksById[task.id] = task;
    });

    this.totalTasks.setValue(Object.keys(workedTasks).length);

    const switches = events.filter((e) => e.type === EventType.SWITCH).length;
    this.totalChanges.setValue(switches);

    events.sort((a, b) => a.time - b.time);
    const intervals: TaskInterval[] = [];
    let intervalStart: number = 0;
    events.forEach((event) => {
      // TODO: some sanity checking or validation
      // might be a good idea
      if (event.type === EventType.START) {
        intervalStart = event.time;
      }
      if (event.type === EventType.STOP) {
        const duration = event.time - intervalStart;
        intervals.push({
          task: tasksById[event.taskId],
          startTime: intervalStart,
          endTime: event.time,
          duration,
        });
        workedTasks[event.taskId].total += duration;
      }
    });

    const totalTime = intervals.reduce((acc, interval) => {
      return acc + interval.duration;
    }, 0);

    this.totalTime.setValue(totalTime);
    this.intervals.setValue(intervals);
    this.taskTotals.setValue(workedTasks);
  }
}
