import React from "react";

import { ActiveTask, ActiveTaskViewPort } from "./ActiveTask";
import { ObservableValue } from "../../lib/hex/observable_value";

export default {
  basic: () => {
    const adapter: ActiveTaskViewPort = {
      name: new ObservableValue("This is a task"),
      link: new ObservableValue("https://example.com"),
      nameInEdit: new ObservableValue(false),
      linkInEdit: new ObservableValue(false),
      time: new ObservableValue("00:12:30:12"),
      timerIsRunning: new ObservableValue(false),
      handleComplete: () => {},
      handleTimerStart: function () {
        this.timerIsRunning.setValue(true);
      },
      handleTimerStop: function () {
        this.timerIsRunning.setValue(false);
      },
      handleUpdateLink: () => {},
      handleUpdateName: () => {},
      startNameEdit: () => {},
      startLinkEdit: () => {},
    };

    return <ActiveTask adapter={adapter} />;
  },
};
