import React from "react";
import { TaskForm, TaskFormViewPort } from "./TaskForm";
import { ObservableValue } from "../../lib/ObservableValue";
import { TaskPosition } from "../ports/TaskPosition";

export default {
  basic: () => {
    const adapter: TaskFormViewPort = {
      name: new ObservableValue(""),
      link: new ObservableValue(""),
      isValid: new ObservableValue(false),
      handleNameChange: function (value: string) {
        this.name.setValue(value);
        this.isValid.setValue(value !== "");
      },
      handleLinkChange: function (value: string) {
        this.link.setValue(value);
      },
      handleAdd: function (position: TaskPosition) {
        alert(`Adding to: ${position}`);
      },
      setRef: function(){}
    };

    return <TaskForm adapter={adapter} />;
  },
};
