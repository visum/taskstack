import { ObservableValue } from "../../lib/ObservableValue";
import { Task } from "../models/Task";
import { Event, EventType } from "../models/Event";
import { ReportTabViewPort, TaskInterval } from "./ReportTab";

export interface ReportTabDomainPort {
  getTasks: () => Promise<Task[]>;
  getEvents: () => Promise<Event[]>;
}

export class ReportTabDomain implements ReportTabViewPort {
  totalTasks: ObservableValue<number> = new ObservableValue(0);
  totalTime: ObservableValue<number> = new ObservableValue(0);
  totalChanges: ObservableValue<number> = new ObservableValue(0);
  intervals = new ObservableValue<TaskInterval[]>([]);

  private adapter: ReportTabDomainPort;

  constructor(adapter: ReportTabDomainPort) {
    this.adapter = adapter;
    this.update();
  }

  update() {
    Promise.all([this.adapter.getEvents(), this.adapter.getTasks()]).then(
      ([events, tasks]) => this.generateReport(events, tasks)
    );
  }

  private generateReport(events: Event[], tasks: Task[]) {
    const eventIds: string[] = [];
    const totalTasks = events.reduce((accumulator, event) => {
      if (!eventIds.includes(event.taskId)) {
        eventIds.push(event.taskId);
        return accumulator + 1;
      }
      return accumulator;
    }, 0);
    // TODO: there are some optimization opportunities here
    const tasksById: Record<string, Task> = {};
    tasks.forEach((task) => {
      tasksById[task.id] = task;
    });

    this.totalTasks.setValue(totalTasks);

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
        intervals.push({
          task: tasksById[event.taskId],
          startTime: intervalStart,
          endTime: event.time,
          duration: event.time - intervalStart,
        });
      }
    });

    const totalTime = intervals.reduce((acc, interval) => {
      return acc + interval.duration;
    }, 0);

    this.totalTime.setValue(totalTime);
    this.intervals.setValue(intervals);
  }
}
