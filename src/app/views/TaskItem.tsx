import React from "react";
import { ObservableValue } from "../../lib/ObservableValue";
import { useAsyncValue } from "../../lib/useAsyncValue";
import { Task } from "../models/Task";

const styles: Record<string, React.CSSProperties> = {
  taskItem: {
    display: "flex",
    padding: '5px',
    borderTop: '1px solid rgba(0,0,0,0.6)'
  },
  leftSide: {
    flex: "2 2 auto",
  },
  rightSide: {
    flex: "1 1 auto",
  },
};

export type TaskItemViewPort = {
  task: Task;
  time: ObservableValue<string>;
  handleReorderUp: () => void;
  handleReorderDown: () => void;
  handleActivate: () => void;
};

export function TaskItem({
  adapter,
  style = {},
}: {
  adapter: TaskItemViewPort;
  style?: React.CSSProperties;
}) {
  const time = useAsyncValue(adapter.time);

  return (
    <div style={{ ...styles.taskItem, ...style }}>
      <div style={styles.leftSide}>
        {adapter.task.name}
        <br />
        {adapter.task.link && (
          <>
            <a href={adapter.task.link} target="_blank" rel="noreferrer">
              {adapter.task.link}
            </a>
            <br />
          </>
        )}
        {time}
      </div>
      <div style={styles.rightSide}>
        <button onClick={() => adapter.handleReorderUp()}>Up</button>
        <button onClick={() => adapter.handleReorderDown()}>Down</button>
        <button onClick={() => adapter.handleActivate()}>Now</button>
      </div>
    </div>
  );
}
