import { Event } from "../../models/Event";
import { EventRepository } from "../EventRepository";
import { IndexedDBClient } from "./IndexedDBClient";

export class IndexedDBEventRepository implements EventRepository {
  client: IndexedDBClient;

  constructor(client: IndexedDBClient) {
    this.client = client;
  }

  private async getReadStore() {
    const db = await this.client.getDB();
    const transaction = db.transaction(
      IndexedDBClient.storeNames.events,
      "readonly"
    );
    const store = transaction.objectStore(IndexedDBClient.storeNames.events);
    return store;
  }

  private async getWriteStore() {
    const db = await this.client.getDB();
    const transaction = db.transaction(
      IndexedDBClient.storeNames.events,
      "readwrite"
    );
    const store = transaction.objectStore(IndexedDBClient.storeNames.events);
    return store;
  }

  listEvents(): Promise<Event[]> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getReadStore();
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result as Event[];
        resolve(results);
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  addEvent(event: Event): Promise<Event> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getWriteStore();
      const record = {
        type: event.type,
        time: event.time,
        taskId: event.taskId,
      };
      const request = store.add(record);
      request.onsuccess = () => {
        const key = request.result;
        resolve({ ...event, id: String(key) });
      };
      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  getEvent(id: string): Promise<Event> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getReadStore();
      const request = store.get(IDBKeyRange.only(parseInt(id, 10)));

      request.onsuccess = () => {
        const result = request.result as Event;
        resolve(result);
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  updateEvent(id: string, newValues: Event): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getWriteStore();
      const record = { ...newValues, id: parseInt(id, 10) };
      const request = store.put(record);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  getEventsForRange(startTime: number, endTime: number): Promise<Event[]> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getReadStore();
      const index = store.index("time");
      const keyRange = IDBKeyRange.bound(startTime, endTime);

      const request = index.getAll(keyRange);
      request.onsuccess = () => {
        const results = request.result as Event[];
        resolve(results);
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  empty(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getWriteStore();
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }
}
