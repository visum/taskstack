import { Event } from "../../models/Event";
import { EventRepository } from "../EventRepository";

export class InMemoryEventRepository implements EventRepository {
  events: Event[] = [];

  listEvents(): Promise<Event[]> {
    return Promise.resolve(this.events);
  }

  addEvent(event: Event): Promise<void> {
    this.events.unshift(event);
    return Promise.resolve();
  }

  getEventsForRange(startTime: number, endTime: number): Promise<Event[]> {
    const events = this.events.filter(
      (event) => event.time >= startTime && event.time <= endTime
    );
    return Promise.resolve(events);
  }

}
