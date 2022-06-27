import { ObservableValue } from "../../lib/hex/observable_value";
import { Tab, TabsViewPort } from "./Tabs";

export class TabsDomain implements TabsViewPort {
  tabs: ObservableValue<Tab[]>;
  activeTabIndex = new ObservableValue<number>(0);

  constructor(tabs: Tab[]) {
    this.tabs = new ObservableValue<Tab[]>(tabs);
  }

  onTabSelect(index: number) {
    this.tabs.getValue()[index]?.onActivate?.();
    this.activeTabIndex.setValue(index);
  }
}
