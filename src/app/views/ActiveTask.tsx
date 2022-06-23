import React from "react";
import { ObservableValue } from "../../lib/ObservableValue";
import { useAsyncValue } from "../../lib/useAsyncValue";

const styles: Record<string, React.CSSProperties> = {
  activeTask: {
    display: "flex",
    border: "1px solid black",
    padding: "5px"
  },
  leftSide: {
    flex: "2 2 auto"
  },
  rightSide: {
    flex: "1 1 auto"
  }
};

export interface ActiveTaskViewPort {
  name: ObservableValue<string>;
  link: ObservableValue<string>;
  nameInEdit: ObservableValue<boolean>;
  linkInEdit: ObservableValue<boolean>;
  time: ObservableValue<string>;
  timerIsRunning: ObservableValue<boolean>;
  handleComplete: () => void;
  handleTimerStart: () => void;
  handleTimerStop: () => void;
  handleUpdateLink: () => void;
  handleUpdateName: () => void;
  startNameEdit: () => void;
  startLinkEdit: () => void;
}

export function ActiveTask({
  adapter,
  style = {}
}: {
  adapter: ActiveTaskViewPort;
  style?: React.CSSProperties;
}) {
  const name = useAsyncValue(adapter.name);
  const link = useAsyncValue(adapter.link);
  // const nameInEdit = useAsyncValue(adapter.nameInEdit);
  // const linkInEdit = useAsyncValue(adapter.linkInEdit);
  const time = useAsyncValue(adapter.time);
  const timerIsRunning = useAsyncValue(adapter.timerIsRunning);

  return (
    <div style={{ ...styles.activeTask, ...style }}>
      <div style={styles.leftSide}>
        Name: {name}
        <br />
        <a href={link} target="_blank" rel="noreferrer">
          {link}
        </a>
        <br />
        {/* <button onClick={() => adapter.handleComplete()}>Complete</button> */}
      </div>
      <div style={styles.rightSide}>
        {time}
        {timerIsRunning ? (
          <button onClick={() => adapter.handleTimerStop()}>⏸</button>
        ) : (
          <button
            onClick={() => {
              adapter.handleTimerStart();
            }}
          >
            ▶️
          </button>
        )}
      </div>
    </div>
  );
}
