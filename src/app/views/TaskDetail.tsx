import React from "react";
import { useAsyncValue } from "../../lib/hex/hooks/use_async_value";
import { TaskDetailDomain } from "./TaskDetailDomain";
import { TaskDetailEvent } from "./TaskDetailEvent";

export function TaskDetail({ domain }: { domain: TaskDetailDomain }) {
  const taskName = useAsyncValue(domain.taskName);
  const taskLink = useAsyncValue(domain.taskLink);
  const eventDetailDomains = useAsyncValue(domain.eventDetailDomains);

  return (
    <div>
      <label>
        Name
        <input
          type="text"
          value={taskName}
          onChange={(event) => domain.handleNameChange(event.target.value)}
        />
      </label>
      <label>
        Link
        <input
          type="text"
          value={taskLink}
          onChange={(event) => domain.handleLinkChange(event.target.value)}
        />
      </label>
      {eventDetailDomains.map((eventDetailDomain) => (
        <TaskDetailEvent key={eventDetailDomain.event.id} domain={eventDetailDomain} />
      ))}
      <button onClick={() => domain.handleCancel()}>Cancel</button>
      <button onClick={() => domain.handleSave()}>Save</button>
    </div>
  );
}
