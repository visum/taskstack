import React from "react";
import { ObservableValue } from "../../lib/ObservableValue";
import { useAsyncValue } from "../../lib/useAsyncValue";
import { ToDoTab, ToDoTabViewPort } from "./ToDoTab";

const styles: Record<string, React.CSSProperties> = {
  tabs: {
    position: "relative"
  },
  buttons: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30px"
  },
  content: {
    position: "absolute",
    top: "30px",
    left: 0,
    right: 0,
    bottom: 0
  }
};

export interface TabsViewPort {
  toDoTabDomain: ObservableValue<ToDoTabViewPort | null>;
  handleSelectToDo: () => void;
  handleSelectDone: () => void;
  handleSelectDay: () => void;
}

export function Tabs({
  adapter,
  style = {}
}: {
  adapter: TabsViewPort;
  style?: React.CSSProperties;
}) {
  const toDoTabDomain = useAsyncValue(adapter.toDoTabDomain);

  return (
    <div style={{ ...styles.tabs, ...style }}>
      <div style={styles.buttons}>
        <button
          onClick={() => adapter.handleSelectToDo()}
          disabled={toDoTabDomain != null}
        >
          ToDo
        </button>
        <button onClick={() => adapter.handleSelectDone()}>Done</button>
        <button onClick={() => adapter.handleSelectDay()}>Day</button>
      </div>
      <div style={styles.content}>
        {toDoTabDomain && <ToDoTab adapter={toDoTabDomain} />}
      </div>
    </div>
  );
}
