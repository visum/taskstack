import React, { useState } from "react";
import { ToDoTab } from "./app/views/ToDoTab";
import { InMemoryTaskRepository } from "./app/repositories/inMemory/InMemoryTaskRepository";
import { InMemoryEventRepository } from "./app/repositories/inMemory/InMemoryEventRepository";
import { TaskStackDomain } from "./app/domains/TaskStackDomain";
import { ToDoTabDomain } from "./app/views/ToDoTabDomain";

import "./styles.css";

export default function App() {
  const [domain] = useState(() => {
    const tasks = new InMemoryTaskRepository();
    const events = new InMemoryEventRepository();
    const taskStackDomain = new TaskStackDomain(tasks, events);
    return new ToDoTabDomain(taskStackDomain);
  });

  return (
    <div className="App">
      <ToDoTab adapter={domain} />
    </div>
  );
}
