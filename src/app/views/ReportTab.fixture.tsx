import React from "react";
import { ReportTab, ReportTabViewPort, TaskTotalRecord } from "./ReportTab";
import { ObservableValue } from "../../lib/hex/observable_value";
import { TaskInterval } from "./ReportTab";
import { Day } from "../ports/Day";

export default {
  basic: () => {
    const adapter: ReportTabViewPort = {
      totalTasks: new ObservableValue<number>(10),
      totalTime: new ObservableValue<number>(8006),
      totalChanges: new ObservableValue<number>(16),
      taskTotals: new ObservableValue<TaskTotalRecord>({
        1: {
          task: {
            id: "12",
            name: "Some Task",
            totalTime: 12800,
            link: "",
            isComplete: false,
          },
          total: 12800,
        },
      }),
      intervals: new ObservableValue<TaskInterval[]>([]),
      day: new ObservableValue<Day>({ year: 2022, month: 6, day: 24 }),
      handleSelectNextDay() {},
      handleSelectPreviousDay() {},
      handleSelectToday() {},
    };

    return <ReportTab adapter={adapter} />;
  },
};
