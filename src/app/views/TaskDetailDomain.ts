import { Task } from "../models/Task";
import { Event } from "../models/Event";
import { ObservableValue } from "../../lib/hex/observable_value";
import {
  TaskDetailEventDomain,
  TaskDetailEventDomainPort,
} from "./TaskDetailEventDomain";

export interface TaskDetailDomainPort extends TaskDetailEventDomainPort {
  updateTask(task: Task): Promise<void>;
  updateEvent(event: Event): Promise<void>;
  getEventsForTask(task: Task): Promise<Event[]>;
  onClose(): void;
}

export class TaskDetailDomain {
  adapter: TaskDetailDomainPort;
  task: Task;
  events = new ObservableValue<Event[]>([]);
  eventDetailDomains = new ObservableValue<TaskDetailEventDomain[]>([]);
  taskName: ObservableValue<string>;
  taskLink: ObservableValue<string>;

  constructor(task: Task, adapter: TaskDetailDomainPort) {
    this.adapter = adapter;
    this.task = task;
    this.taskName = new ObservableValue(task.name);
    this.taskLink = new ObservableValue(task.link);
    this.loadEvents();
  }

  async updateEvent(eventId: string, time: number) {
    const allEvents = this.events.getValue();
    const theEvent = allEvents.find((e) => e.id === eventId);
    if (!theEvent) {
      throw new Error("Couldn't find that event");
    }
    const record = { ...theEvent };
    record.time = time;
    return this.adapter.updateEvent(record).then(() => this.loadEvents());
  }

  handleNameChange(value: string) {
    this.taskName.setValue(value);
  }

  handleLinkChange(value: string) {
    this.taskLink.setValue(value);
  }

  async handleSave() {
    await this.updateTask();
    this.adapter.onClose();
  }

  handleCancel() {
    this.adapter.onClose();
  }

  private loadEvents() {
    this.adapter.getEventsForTask(this.task).then((events) => {
      this.events.setValue(events);
      this.eventDetailDomains.setValue(
        events.map(
          (e) => new TaskDetailEventDomain(e, this.adapter)
        )
      );
    });
  }

  private async updateTask() {
    const record = { ...this.task };
    record.name = this.taskName.getValue();
    record.link = this.taskLink.getValue();
    return this.adapter.updateTask(record);
  }
}
