import React from "react";
import { ObservableValue } from "../../lib/hex/observable_value";
import { useAsyncValue } from "../../lib/hex/hooks/use_async_value";
import { Task } from "../models/Task";

const styles: Record<string, React.CSSProperties> = {
  taskItem: {
    display: "flex",
    padding: '5px',
    borderTop: '1px solid rgba(0,0,0,0.6)'
  },
  leftSide: {
    flex: "1 1 70%",
  },
  rightSide: {
    flex: "1 1 30%",
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
