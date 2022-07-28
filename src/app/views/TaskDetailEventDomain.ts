import { Event } from "../models/Event";
import { ObservableValue } from "../../lib/hex/observable_value";

export interface TaskDetailEventDomainPort {
  updateEvent(event: Event): Promise<void>;
}

export class TaskDetailEventDomain {
  adapter: TaskDetailEventDomainPort;
  isInEdit = new ObservableValue(false);
  timeValue = new ObservableValue<string>("");
  event: Event;

  constructor(event: Event, adapter: TaskDetailEventDomainPort) {
    this.event = event;
    this.adapter = adapter;
  }

  startEdit() {
    this.isInEdit.setValue(true);
    this.timeValue.setValue(new Date(this.event.time).toLocaleString());
  }

  stopEdit() {
    this.isInEdit.setValue(false);
  }

  handleTimeEdit(value:string) {
    this.timeValue.setValue(value);
  }

  async save() {
    const parsed = Date.parse(this.timeValue.getValue());
    if(!isNaN(parsed)) {
      const record = { ...this.event, time: parsed };
      await this.adapter.updateEvent(record);
    }
    this.stopEdit();
  }
}
