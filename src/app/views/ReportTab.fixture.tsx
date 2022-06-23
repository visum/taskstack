import React from "react";
import { ReportTab, ReportTabViewPort } from "./ReportTab";
import { ObservableValue } from "../../lib/ObservableValue";
import { TaskInterval } from "./ReportTab";

export default {
  basic: () => {
    const adapter: ReportTabViewPort = {
      totalTasks: new ObservableValue<number>(10),
      totalTime: new ObservableValue<number>(8006),
      totalChanges: new ObservableValue<number>(16),
      intervals: new ObservableValue<TaskInterval[]>([]),
    };

    return <ReportTab adapter={adapter} />;
  },
};
