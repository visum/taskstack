import React from "react";
import { ObservableValue } from "../../lib/ObservableValue";
import { useAsyncValue } from "../../lib/useAsyncValue";

const styles: Record<string, React.CSSProperties> = {
  taskForm: {
    display: "flex",
    flexDirection: "column"
  }
};

export interface TaskFormViewPort {
  name: ObservableValue<string>;
  link: ObservableValue<string>;
  handleNameChange: (value: string) => void;
  handleLinkChange: (value: string) => void;
  handleAdd: (position: "top" | "next" | "now") => void;
}

export function TaskForm({
  adapter,
  style = {}
}: {
  adapter: TaskFormViewPort;
  style?: React.CSSProperties;
}) {
  const name = useAsyncValue(adapter.name);
  const link = useAsyncValue(adapter.link);

  return (
    <div style={{ ...styles.taskForm, ...style }}>
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
      <button onClick={() => adapter.handleAdd("top")}>Top</button>
      <button onClick={() => adapter.handleAdd("next")}>Next</button>
      <button onClick={() => adapter.handleAdd("now")}>Now</button>
    </div>
  );
}
