import { Event } from "../models/Event";

export interface EventRepository {
  listEvents(): Promise<Event[]>;
  addEvent(event: Event): Promise<void>;
  getEventsForRange(startTime: number, endTime: number): Promise<Event[]>;
}
