import React from "react";
import { ObservableValue } from "../../lib/ObservableValue";
import { useAsyncValue } from "../../lib/useAsyncValue";
import { TaskPosition } from "../ports/TaskPosition";

const styles: Record<string, React.CSSProperties> = {
  taskForm: {
    display: "flex",
    padding: '5px',
    border: '1px solid black'
  },
  leftSide: {
    flex: "1 1 70%",
    display: "flex",
    flexDirection: "column",
  },
  rightSide: {
    flex: "1 1 30%",
    display: "flex",
    flexDirection: "column",
  },
};

export interface TaskFormViewPort {
  name: ObservableValue<string>;
  link: ObservableValue<string>;
  isValid: ObservableValue<boolean>;
  handleNameChange: (value: string) => void;
  handleLinkChange: (value: string) => void;
  handleAdd: (position: TaskPosition) => void;
  setRef: (element: HTMLDivElement | null) => void;
}

export function TaskForm({
  adapter,
  style = {},
}: {
  adapter: TaskFormViewPort;
  style?: React.CSSProperties;
}) {
  const name = useAsyncValue(adapter.name);
  const link = useAsyncValue(adapter.link);
  const isValid = useAsyncValue(adapter.isValid);

  return (
    <div
      style={{ ...styles.taskForm, ...style }}
      ref={(element) => adapter.setRef(element)}
    >
      <div style={styles.leftSide}>
        <div>Add Task:</div>
        <label>
          Name{" "}
          <input
            type="text"
            value={name}
            onChange={(event) => adapter.handleNameChange(event.target.value)}
          />
        </label>
        <label>
          Link{" "}
          <input
            type="text"
            value={link}
            onChange={(event) => adapter.handleLinkChange(event.target.value)}
          />
        </label>
      </div>
      <div style={styles.rightSide}>
        <button onClick={() => adapter.handleAdd("last")} disabled={!isValid}>
          Add (Enter)
        </button>
        <button onClick={() => adapter.handleAdd("next")} disabled={!isValid}>
          Next (Shift + Enter)
        </button>
        <button onClick={() => adapter.handleAdd("now")} disabled={!isValid}>
          Now (Ctrl + Enter)
        </button>
      </div>
    </div>
  );
}
