import { UtilitiesTabPort } from "./UtilitiesTab";
import { DataStore } from "../repositories/DataStore";

export interface UtilitiesTabDomainPort {
  dataStore: DataStore;
}

export class UtiliesTabDomain implements UtilitiesTabPort {
  dataStore: DataStore;

  constructor(dataStore: DataStore) {
    this.dataStore = dataStore;
  }

  async clearData(): Promise<void> {
    const taskRepository = await this.dataStore.getTaskRepository();
    const eventRepository = await this.dataStore.getEventRepository();
    return Promise.all([
      taskRepository.empty(),
      eventRepository.empty(),
    ]).then();
  }
}
