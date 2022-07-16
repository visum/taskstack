export class IndexedDBClient {
  private DB_VERSION = 1;
  private db: IDBDatabase | null = null;
  private databaseName: string;

  static storeNames = {
    events: "events",
    tasks: "tasks",
    sort: "sort"
  };

  constructor(databaseName = "taskstack") {
    if (!window.indexedDB) {
      throw new Error("IndexedDB is not supported on this platform");
    }
    this.databaseName = databaseName;
    this.init();
  }

  getDB() {
    return this.init();
  }

  private init(): Promise<IDBDatabase> {
    if (this.db != null) {
      return Promise.resolve(this.db);
    }

    const result = new Promise<IDBDatabase>((resolve, reject) => {
      const request = window.indexedDB.open(this.databaseName, this.DB_VERSION);

      request.onupgradeneeded = this.handleDBUpgrade;
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      request.onerror = (event) => {
        reject(event);
      };
    });

    return result;
  }

  private handleDBUpgrade(event: IDBVersionChangeEvent) {
    const newVersion = event.newVersion;
    if (newVersion != null) {
      // some typing info gets lost in the `EventTarget` interface
      const db = (event.target as IDBOpenDBRequest).result;
      schemaCreators[newVersion](db);
    }
  }
}

const schemaCreators: Record<number, (db: IDBDatabase) => void> = {
  1: (db: IDBDatabase) => {
    const eventStore = db.createObjectStore(IndexedDBClient.storeNames.events, {
      keyPath: "id",
      autoIncrement: true,
    });
    eventStore.createIndex("time", "time", {unique: false});

    const taskStore = db.createObjectStore(IndexedDBClient.storeNames.tasks, {
      keyPath: "id",
      autoIncrement: true,
    });
    taskStore.createIndex("isComplete", "isComplete", {unique: false});

    db.createObjectStore(IndexedDBClient.storeNames.sort, {
      keyPath: "sort",
      autoIncrement: false
    });
  },
};
