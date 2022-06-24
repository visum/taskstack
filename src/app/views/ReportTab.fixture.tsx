import React from "react";
import { ReportTab, ReportTabViewPort } from "./ReportTab";
import { ObservableValue } from "../../lib/ObservableValue";
import { TaskInterval } from "./ReportTab";
import { Day } from "../ports/Day";

export default {
  basic: () => {
    const adapter: ReportTabViewPort = {
      totalTasks: new ObservableValue<number>(10),
      totalTime: new ObservableValue<number>(8006),
      totalChanges: new ObservableValue<number>(16),
      intervals: new ObservableValue<TaskInterval[]>([]),
      day: new ObservableValue<Day>({ year: 2022, month: 6, day: 24 }),
      handleSelectNextDay() {},
      handleSelectPreviousDay() {},
      handleSelectToday() {},
    };

    return <ReportTab adapter={adapter} />;
  },
};
