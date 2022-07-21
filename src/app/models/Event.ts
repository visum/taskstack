export enum EventType {
  START,
  STOP,
  SWITCH
}

export class Event {
  id: string;
  taskId: string;
  type: EventType;
  time: number;
}
