import React from "react";
import { ObservableValue } from "../../lib/hex/observable_value";
import {Tab, Tabs, TabsViewPort} from "./Tabs";

export default {
  basic: () => {
    const adapter:TabsViewPort = {
      activeTabIndex: new ObservableValue(0),
      tabs: new ObservableValue<Tab[]>([{
        title: "Tab One",
        getContents: () => <div>I am some content</div>
      },{
        title: "Tab Two",
        getContents: () => <div>I am some more content</div>
      }]),
      onTabSelect(index){
        this.activeTabIndex.setValue(index);
      },

    };

    return <Tabs adapter={adapter} />
  }
};