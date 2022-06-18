import React from "react";
import { Task } from "../models/Task";

const styles: Record<string, React.CSSProperties> = {
  taskItem: {
    display: "flex"
  },
  leftSide: {
    flex: "2 2 auto"
  },
  rightSide: {
    flex: "1 1 auto"
  }
};

export type TaskItemViewPort = {
  task: Task;
  handleReorderUp: () => void;
  handleReorderDown: () => void;
  handleActivate: () => void;
};

export function TaskItem({
  adapter,
  style = {}
}: {
  adapter: TaskItemViewPort;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ ...styles.taskItem, ...style }}>
      <div style={styles.leftSide}>
        Name: {adapter.task.name}
        Link:{" "}
        <a href={adapter.task.link} target="_blank" rel="noreferrer">
          {adapter.task.link}
        </a>
      </div>
      <div style={styles.rightSide}>
        <button onClick={() => adapter.handleReorderUp()}>Up</button>
        <button onClick={() => adapter.handleReorderDown()}>Down</button>
        <button onClick={() => adapter.handleActivate()}>Now</button>
      </div>
    </div>
  );
}
