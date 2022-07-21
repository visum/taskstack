import { Event } from "../../models/Event";
import { EventRepository } from "../EventRepository";

export class InMemoryEventRepository implements EventRepository {
  private events = new Map<string, Event>();
  private idCount = 0;

  listEvents(): Promise<Event[]> {
    return Promise.resolve([...this.events.values()]);
  }

  addEvent(event: Event): Promise<Event> {
    const newId = String(this.idCount++);
    const record:Event = {...event, id: newId};
    this.events.set(newId, record);
    return Promise.resolve(record);
  }

  getEvent(id: string): Promise<Event> {
    const result = this.events.get(id);
    if(!result) {
      throw new Error("event not found");
    }
    return Promise.resolve(result);
  }

  updateEvent(id: string, newValues: Event): Promise<void> {
    const existingEvent = this.events.get(id);
    if(!existingEvent) {
      throw new Error("Event not found");
    }
    Object.assign(existingEvent, newValues);
    return Promise.resolve();
  }

  getEventsForRange(startTime: number, endTime: number): Promise<Event[]> {
    const allEvents = [...this.events.values()];
    const events = allEvents.filter(
      (event) => event.time >= startTime && event.time <= endTime
    );
    return Promise.resolve(events);
  }

  empty() {
    this.events.clear();
    return Promise.resolve();
  }

}
