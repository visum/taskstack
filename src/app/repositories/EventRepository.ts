import { Event } from "../models/Event";

export interface EventRepository {
  listEvents(): Promise<Event[]>;
  addEvent(event: Event): Promise<Event>;
  getEvent(id: string): Promise<Event>;
  updateEvent(id: string, newValues: Event): Promise<void>;
  getEventsForRange(startTime: number, endTime: number): Promise<Event[]>;
  empty(): Promise<void>;
}
