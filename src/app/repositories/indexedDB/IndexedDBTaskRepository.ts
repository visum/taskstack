import { Task } from "../../models/Task";
import { TaskPosition } from "../../ports/TaskPosition";
import { TaskRepository } from "../TaskRepository";
import { IndexedDBClient } from "./IndexedDBClient";

interface SortEntry {
  sort: string;
  value: string[];
}

interface DBTask {
  id: string;
  name: string;
  link: string;
  totalTime: number;
  isComplete: string;
}

export class IndexedDBTaskRepository implements TaskRepository {
  client: IndexedDBClient;

  constructor(client: IndexedDBClient) {
    this.client = client;
  }

  private async getReadStore() {
    const db = await this.client.getDB();
    const transaction = db.transaction(
      IndexedDBClient.storeNames.tasks,
      "readonly"
    );
    const store = transaction.objectStore(IndexedDBClient.storeNames.tasks);
    return store;
  }

  private async getWriteStore() {
    const db = await this.client.getDB();
    const transaction = db.transaction(
      IndexedDBClient.storeNames.tasks,
      "readwrite"
    );
    const store = transaction.objectStore(IndexedDBClient.storeNames.tasks);
    return store;
  }

  private async getSortReadStore() {
    const db = await this.client.getDB();
    const transaction = db.transaction(
      IndexedDBClient.storeNames.sort,
      "readonly"
    );
    const store = transaction.objectStore(IndexedDBClient.storeNames.sort);
    return store;
  }

  private async getSortWriteStore() {
    const db = await this.client.getDB();
    const transaction = db.transaction(
      IndexedDBClient.storeNames.sort,
      "readwrite"
    );
    const store = transaction.objectStore(IndexedDBClient.storeNames.sort);
    return store;
  }

  private pack(input: Task): DBTask {
    return { ...input, isComplete: input.isComplete ? "true" : "false" };
  }

  private unpack(input: DBTask): Task {
    return { ...input, isComplete: input.isComplete === "true" ? true : false };
  }

  async listTasks(includeComplete: boolean): Promise<Task[]> {
    const sortOrder = await this.getSortOrder();

    return new Promise(async (resolve, reject) => {
      const store = await this.getReadStore();
      const index = store.index("isComplete");

      let request: IDBRequest;
      if (includeComplete) {
        request = index.getAll();
      } else {
        const keyRange = IDBKeyRange.only("false");
        request = index.getAll(keyRange);
      }

      request.onsuccess = () => {
        const results = request.result as DBTask[];

        const sorted = sortOrder.map(
          (id) => results.find((item) => item.id === id) as DBTask
        );

        const pruned = sorted.filter(i => i != null);

        resolve(pruned.map(this.unpack));
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  getSortOrder(): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getSortReadStore();
      const request = store.get("default");

      request.onsuccess = () => {
        const result = request.result as SortEntry;
        if (!result) {
          resolve([]);
          return;
        }
        resolve(result.value);
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  updateSortOrder(newOrder: string[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getSortWriteStore();
      const request = store.put({ sort: "default", value: newOrder });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  async addTask(task: Task, position: TaskPosition): Promise<Task> {
    const sortOrder = await this.getSortOrder();

    return new Promise(async (resolve, reject) => {
      const store = await this.getWriteStore();

      const packed = this.pack(task);
      const noId = {
        name: packed.name,
        link: packed.link,
        totalTime: packed.totalTime,
        isComplete: packed.isComplete,
      };

      const request = store.add(noId);
      request.onsuccess = (event) => {
        const key = (event.target as IDBRequest).result;

        if (position === "next") {
          sortOrder.splice(1, 0, key);
        } else if (position === "now") {
          sortOrder.unshift(key);
        } else if (position === "last") {
          sortOrder.push(key);
        }

        this.updateSortOrder(sortOrder);

        resolve({ ...task, id: String(key) });
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  countTasks(includeComplete: boolean) {
    return new Promise(async (resolve, reject) => {
      const store = await this.getReadStore();
      const index = store.index("isComplete");
      const request = includeComplete
        ? index.count()
        : index.count(IDBKeyRange.only("false"));

      request.onsuccess = () => {
        const count = request.result;
        resolve(count);
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  getTask(id: string): Promise<Task> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getReadStore();
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(this.unpack(request.result as DBTask));
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  updateTask(id: string, newValues: Task): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getWriteStore();
      const data = { ...newValues, id };
      const request = store.put(this.pack(data));
      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  deleteTask(id: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const store = await this.getWriteStore();
      const request = store.delete(id);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject();
      };
    });
  }

  async reorderTask(id: string, offset: number): Promise<void> {
    const sortOrder = await this.getSortOrder();
    const index = sortOrder.indexOf(id);
    if (index === -1) {
      return Promise.reject(`Task ${id} not found`);
    }
    sortOrder.splice(index, 1);
    sortOrder.splice(index + offset, 0, id);
    return this.updateSortOrder(sortOrder);
  }

  async moveTaskToFront(id: string): Promise<void> {
    const sortOrder = await this.getSortOrder();
    const index = sortOrder.indexOf(id);
    if (index === -1) {
      return Promise.reject(`Task ${id} not found`);
    }
    sortOrder.splice(index, 1);
    sortOrder.unshift(id);
    return this.updateSortOrder(sortOrder);
  }

  empty(): Promise<void> {
    const taskPromise = new Promise<void>(async (resolve, reject) => {
      const store = await this.getWriteStore();
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event);
      };
    });

    const sortPromise = new Promise<void>(async (resolve, reject) => {
      const store = await this.getSortWriteStore();
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event);
      };
    });

    return Promise.all([taskPromise, sortPromise]).then();
  }
}
