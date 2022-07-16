import React, { useState } from "react";
import { getToDoTab } from "./app/views/ToDoTab";
// import { LocalStorageDataStore } from "./app/repositories/localStorage/LocalStorageDataStore";
import { IndexedDBDataStore } from "./app/repositories/indexedDB/IndexedDBDataStore";
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
    // const dataStore = new LocalStorageDataStore();
    const dataStore = new IndexedDBDataStore();
    const taskStackDomain = new TaskStackDomain(dataStore);
    const toDoTabDomain = new ToDoTabDomain(taskStackDomain);
    const utilitiesTabDomain = new UtiliesTabDomain(dataStore);
    const reportTabDomain = new ReportTabDomain(
      new ReportTabDomainAdapter(dataStore)
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
