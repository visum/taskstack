import React, { useState } from "react";
import { getToDoTab } from "./app/views/ToDoTab";
// import { InMemoryTaskRepository } from "./app/repositories/inMemory/InMemoryTaskRepository";
// import { InMemoryEventRepository } from "./app/repositories/inMemory/InMemoryEventRepository";
import { LocalStorageEventRepository } from "./app/repositories/localStorage/LocalStorageEventRepository";
import { LocalStorageTaskRepository } from "./app/repositories/localStorage/LocalStorageTaskRepository";
import { TaskStackDomain } from "./app/domains/TaskStackDomain";
import { ToDoTabDomain } from "./app/views/ToDoTabDomain";
import { getReport } from "./app/views/ReportTab";
import { Tabs, Tab } from "./app/views/Tabs";
import { TabsDomain } from "./app/views/TabsDomain";
import { ReportTabDomain } from "./app/views/ReportTabDomain";
import { ReportTabDomainAdapter } from "./app/domains/ReportTabDomainAdapter";
import { UtiliesTabDomain } from "./app/views/UtilitiesTabDomain";
import { getUtilitiesTab } from "./app/views/UtilitiesTab";

import "./styles.css";

export default function App() {
  const [tabsDomain] = useState(() => {
    const tasks = new LocalStorageTaskRepository();
    const events = new LocalStorageEventRepository();
    const taskStackDomain = new TaskStackDomain(tasks, events);
    const toDoTabDomain = new ToDoTabDomain(taskStackDomain);
    const utilitiesTabDomain = new UtiliesTabDomain(tasks, events);
    const reportTabDomain = new ReportTabDomain(
      new ReportTabDomainAdapter(tasks, events)
    );

    const tabs: Tab[] = [
      {
        title: "ToDo",
        getContents: () => getToDoTab(toDoTabDomain),
        onActivate: () => toDoTabDomain.update(),
      },
      {
        title: "Report",
        getContents: () => getReport(reportTabDomain),
        onActivate: () => reportTabDomain.update(),
      },
      {
        title: "Utilities",
        getContents: () => getUtilitiesTab(utilitiesTabDomain),
      },
    ];

    return new TabsDomain(tabs);
  });

  return (
    <div className="App">
      <Tabs adapter={tabsDomain} />
    </div>
  );
}
