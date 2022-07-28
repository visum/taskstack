import { Event } from "../../models/Event";
import { EventRepository } from "../EventRepository";

export class LocalStorageEventRepository implements EventRepository {
  private events = new Map<string, Event>();
  private storageKeyPrefix: string;
  private idCounter = 0;

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
      const savedEvents = JSON.parse(payload) as Event[];
      this.events = new Map<string, Event>();
      savedEvents.forEach((e) => {
        this.events.set(e.id, e);
      });
    } else {
      this.events = new Map<string, Event>();
    }
    const idPayload = window.localStorage.getItem(`${this.getStorageKey()}_id`);
    if (idPayload) {
      this.idCounter = parseInt(idPayload, 10);
    } else {
      this.idCounter = 0;
    }
  }

  private save() {
    const payload = JSON.stringify([...this.events.values()]);
    window.localStorage.setItem(this.getStorageKey(), payload);
    window.localStorage.setItem(`${this.getStorageKey()}_id`, String(this.idCounter));
  }

  listEvents(): Promise<Event[]> {
    return Promise.resolve([...this.events.values()]);
  }

  addEvent(event: Event): Promise<Event> {
    const record = { ...event, id: String(this.idCounter++) };
    this.events.set(event.id, event);
    this.save();
    return Promise.resolve(record);
  }

  getEvent(id: string): Promise<Event> {
    const result = this.events.get(id);
    if (!result) {
      throw new Error("Event not found");
    }
    return Promise.resolve(result);
  }

  updateEvent(id: string, newValues: Event): Promise<void> {
    const result = this.events.get(id);
    if (!result) {
      throw new Error("Event not found");
    }
    Object.assign(result, newValues);
    this.save();
    return Promise.resolve();
  }

  getEventsForRange(startTime: number, endTime: number): Promise<Event[]> {
    const allEvents = [...this.events.values()];
    const events = allEvents.filter(
      (event) => event.time >= startTime && event.time < endTime
    );
    return Promise.resolve(events);
  }

  empty(): Promise<void> {
    window.localStorage.removeItem(this.getStorageKey());
    this.load();
    return Promise.resolve();
  }
}
