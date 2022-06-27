import React from "react";
import { TaskItem, TaskItemViewPort } from "./TaskItem";
import { ObservableValue } from "../../lib/hex/observable_value";

export default {
  basic: () => {
    const adapter: TaskItemViewPort = {
      task: {
        name: "Some Great Task",
        link: "https://example.com",
        totalTime: 120000,
        id: "1",
        isComplete: false,
      },
      time: new ObservableValue("00:00:02:12"),
      handleReorderUp() {
        alert("Going up! /\\")
      },
      handleReorderDown() {
        alert("going down \\/")
      },
      handleActivate() {
        alert("My time is now!")
      },
    };

    return <TaskItem adapter={adapter} />
  },
};
