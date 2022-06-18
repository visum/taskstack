export enum EventType {
  START,
  STOP,
  SWITCH
}

export class Event {
  taskId: string;
  type: EventType;
  time: number;
}
