import React from "react";
import { ObservableValue } from "../../lib/hex/observable_value";
import { useAsyncValue } from "../../lib/hex/hooks/use_async_value";
import { ActiveTask, ActiveTaskViewPort } from "./ActiveTask";
import { TaskForm, TaskFormViewPort } from "./TaskForm";
import { TaskList, TaskListViewPort } from "./TaskList";

export interface ToDoTabViewPort {
  taskListDomain: TaskListViewPort;
  activeTaskDomain: ObservableValue<ActiveTaskViewPort | null>;
  taskFormDomain: ObservableValue<TaskFormViewPort | null>;
}

export function ToDoTab({
  adapter,
  style = {},
}: {
  adapter: ToDoTabViewPort;
  style?: React.CSSProperties;
}) {
  const taskListDomain = adapter.taskListDomain;
  const activeTaskDomain = useAsyncValue(adapter.activeTaskDomain);
  const taskFormDomain = useAsyncValue(adapter.taskFormDomain);

  return (
    <div style={{ ...style }}>
      {activeTaskDomain && <ActiveTask adapter={activeTaskDomain} />}
      <TaskList adapter={taskListDomain} />
      {taskFormDomain && <TaskForm adapter={taskFormDomain} />}
    </div>
  );
}

export function getToDoTab(
  adapter: ToDoTabViewPort,
  style: React.CSSProperties = {}
) {
  return <ToDoTab adapter={adapter} style={style} />;
}
