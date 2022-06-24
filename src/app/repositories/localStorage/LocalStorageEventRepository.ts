import { Event } from "../../models/Event";
import { EventRepository } from "../EventRepository";

export class LocalStorageEventRepository implements EventRepository {
  private events: Event[] = [];
  private storageKeyPrefix: string;

  constructor(storageKeyPrefix: string = "TS") {
    if (!window.localStorage) {
      throw new Error("LocalStorage is not supported in this environment");
    }
    this.storageKeyPrefix = storageKeyPrefix;
    this.load();
  }

  private getStorageKey() {
    return `${this.storageKeyPrefix}-events`;
  }

  private load() {
    const payload = window.localStorage.getItem(this.getStorageKey());
    if (payload) {
      this.events = JSON.parse(payload);
    } else {
      this.events = [];
    }
  }

  private save() {
    const payload = JSON.stringify(this.events);
    window.localStorage.setItem(this.getStorageKey(), payload);
  }

  listEvents(): Promise<Event[]> {
    return Promise.resolve(this.events);
  }

  addEvent(event: Event): Promise<void> {
    this.events.unshift(event);
    this.save();
    return Promise.resolve();
  }

  getEventsForRange(startTime: number, endTime: number): Promise<Event[]> {
    const events = this.events.filter(
      (event) => event.time >= startTime && event.time < endTime
    );
    return Promise.resolve(events);
  }
}
