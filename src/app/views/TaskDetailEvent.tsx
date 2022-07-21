import React from "react";
import { useAsyncValue } from "../../lib/hex/hooks/use_async_value";
import { EventType } from "../models/Event";
import { TaskDetailEventDomain } from "./TaskDetailEventDomain";

const typeToName: Record<EventType, string> = {
  [EventType.START]: "Start",
  [EventType.STOP]: "Stop",
  [EventType.SWITCH]: "Switch",
};

export function TaskDetailEvent({ domain }: { domain: TaskDetailEventDomain }) {
  const isInEdit = useAsyncValue(domain.isInEdit);
  const timeString = useAsyncValue(domain.timeValue);

  return (
    <div>
      {isInEdit ? (
        <div>
          {typeToName[domain.event.type]}{" "}
          <input
            type="text"
            value={timeString}
            onChange={(e) => domain.handleTimeEdit(e.target.value)}
          />
          <button onClick={() => domain.save()}>💾</button>
        </div>
      ) : (
        <div>
          {typeToName[domain.event.type]} -{" "}
          {new Date(domain.event.time).toLocaleString()}
          <button onClick={() => domain.startEdit()}>✏️</button>
        </div>
      )}
    </div>
  );
}
