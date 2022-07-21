import React from "react";
import { ObservableValue } from "../../lib/hex/observable_value";
import { useAsyncValue } from "../../lib/hex/hooks/use_async_value";
import { TaskDetailDomain } from "./TaskDetailDomain";
import { TaskDetail } from "./TaskDetail";
import { useModalService } from "../components/ModalService";
import { useEffect } from "react";

const styles: Record<string, React.CSSProperties> = {
  activeTask: {
    display: "flex",
    border: "1px solid black",
    padding: "5px",
  },
  leftSide: {
    flex: "2 2 auto",
  },
  rightSide: {
    flex: "1 1 auto",
  },
};

export interface ActiveTaskViewPort {
  name: ObservableValue<string>;
  link: ObservableValue<string>;
  nameInEdit: ObservableValue<boolean>;
  linkInEdit: ObservableValue<boolean>;
  time: ObservableValue<string>;
  timerIsRunning: ObservableValue<boolean>;
  taskDetailDomain: ObservableValue<TaskDetailDomain | null>;
  handleComplete: () => void;
  handleTimerStart: () => void;
  handleTimerStop: () => void;
  handleShowDetail: () => void;
}

export function ActiveTask({
  adapter,
  style = {},
}: {
  adapter: ActiveTaskViewPort;
  style?: React.CSSProperties;
}) {
  const modalDomain = useModalService();
  const name = useAsyncValue(adapter.name);
  const link = useAsyncValue(adapter.link);
  const time = useAsyncValue(adapter.time);
  const timerIsRunning = useAsyncValue(adapter.timerIsRunning);
  const taskDetailDomain = useAsyncValue(adapter.taskDetailDomain);

  useEffect(() => {
    if (modalDomain && taskDetailDomain) {
      modalDomain.open(<TaskDetail domain={taskDetailDomain} />);
    }

    return () => {
      modalDomain && modalDomain.close();
    };
  }, [modalDomain, taskDetailDomain]);

  return (
    <div style={{ ...styles.activeTask, ...style }}>
      <div style={styles.leftSide}>
        Name: {name}
        <br />
        <a href={link} target="_blank" rel="noreferrer">
          {link}
        </a>
        <br />
        <button onClick={() => adapter.handleComplete()}>Complete</button>
        <button onClick={() => adapter.handleShowDetail()}>Edit</button>
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
