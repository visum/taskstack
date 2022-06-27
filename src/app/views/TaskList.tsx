import React from "react";
import { ObservableValue } from "../../lib/hex/observable_value";
import { useAsyncValue } from "../../lib/hex/hooks/use_async_value";
import { TaskItemViewPort, TaskItem } from "./TaskItem";
import {Task} from "../models/Task";

const styles: Record<string, React.CSSProperties> = {
  taskList: {
    display: "flex",
    flexDirection: "column"
  }
};

export interface TaskListViewPort {
  tasks: ObservableValue<TaskItemViewPort[]>;
  updateList(tasks:Task[]):void;
}

export function TaskList({
  adapter,
  style = {}
}: {
  adapter: TaskListViewPort;
  style?: React.CSSProperties;
}) {
  const tasks = useAsyncValue(adapter.tasks);
  return (
    <div style={{ ...styles.taskList, ...style }}>
      {tasks.map((domain) => (
        <TaskItem key={domain.task.id} adapter={domain} />
      ))}
    </div>
  );
}
