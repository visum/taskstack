import React from "react";
import { ActiveTask, ActiveTaskViewPort } from "./ActiveTask";
import { TaskForm, TaskFormViewPort } from "./TaskForm";
import { TaskList, TaskListViewPort } from "./TaskList";

export interface ToDoTabViewPort {
  taskListDomain: TaskListViewPort;
  activeTaskDomain: ActiveTaskViewPort;
  taskFormDomain: TaskFormViewPort;
}

export function ToDoTab({
  adapter,
  style = {}
}: {
  adapter: ToDoTabViewPort;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ ...style }}>
      <TaskList adapter={adapter.taskListDomain} />
      <ActiveTask adapter={adapter.activeTaskDomain} />
      <TaskForm adapter={adapter.taskFormDomain} />
    </div>
  );
}
