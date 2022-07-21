import React from "react";
import { Task } from "../models/Task";
import { Event, EventType } from "../models/Event";
import { TaskDetail } from "./TaskDetail";
import { TaskDetailDomain, TaskDetailDomainPort } from "./TaskDetailDomain";

let task: Task = {
  id: "1",
  name: "Some Task",
  link: "https://www.google.com",
  totalTime: 12,
  isComplete: false,
};

const events: Event[] = [
  {
    id: "1",
    time: new Date(2022, 6, 24, 8).getTime(),
    type: EventType.START,
    taskId: "1",
  },
  {
    id: "2",
    time: new Date(2022, 6, 24, 8, 45).getTime(),
    type: EventType.STOP,
    taskId: "1",
  },
  {
    id: "3",
    time: new Date(2022, 6, 24, 11).getTime(),
    type: EventType.START,
    taskId: "1",
  },
  {
    id: "4",
    time: new Date(2022, 6, 24, 13, 34).getTime(),
    type: EventType.STOP,
    taskId: "1",
  },
];

const adapter: TaskDetailDomainPort = {
  updateTask: function (newTask: Task): Promise<void> {
    task = newTask;
    return Promise.resolve();
  },
  updateEvent: function (event: Event): Promise<void> {
    const match = events.find((e) => e.id === event.id) as Event;
    Object.assign(match, event);
    return Promise.resolve();
  },
  getEventsForTask: function (_task: Task): Promise<Event[]> {
    return Promise.resolve(events);
  },
  onClose() { },
};

const domain = new TaskDetailDomain(task, adapter);

export default function TaskDetailFixture() {
  return <TaskDetail domain={domain} />;
}
