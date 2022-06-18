import React from "react";
import { ObservableValue } from "../../lib/ObservableValue";
import { useAsyncValue } from "../../lib/useAsyncValue";
import { ActiveTask, ActiveTaskViewPort } from "./ActiveTask";
import { TaskForm, TaskFormViewPort } from "./TaskForm";
import { TaskList, TaskListViewPort } from "./TaskList";

export interface ToDoTabViewPort {
  taskListDomain: ObservableValue<TaskListViewPort>;
  activeTaskDomain: ObservableValue<ActiveTaskViewPort | null>;
  taskFormDomain: ObservableValue<TaskFormViewPort | null>;
}

export function ToDoTab({
  adapter,
  style = {}
}: {
  adapter: ToDoTabViewPort;
  style?: React.CSSProperties;
}) {
  const taskListDomain = useAsyncValue(adapter.taskListDomain);
  const activeTaskDomain = useAsyncValue(adapter.activeTaskDomain);
  const taskFormDomain = useAsyncValue(adapter.taskFormDomain);

  return (
    <div style={{ ...style }}>
      <TaskList adapter={taskListDomain} />
      {activeTaskDomain && <ActiveTask adapter={activeTaskDomain} />}
      {taskFormDomain && <TaskForm adapter={taskFormDomain} />}
    </div>
  );
}
