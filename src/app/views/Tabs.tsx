import React from "react";
import { ObservableValue } from "../../lib/hex/observable_value";
import { useAsyncValue } from "../../lib/hex/hooks/use_async_value";

const styles: Record<string, React.CSSProperties> = {
  tabs: {
    position: "relative",
  },
  buttons: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30px",
  },
  content: {
    position: "absolute",
    top: "30px",
    left: 0,
    right: 0,
    bottom: 0,
  },
};

export interface Tab {
  title: string;
  getContents: () => React.ReactElement;
  onActivate?: () => void;
}

export interface TabsViewPort {
  tabs: ObservableValue<Tab[]>;
  activeTabIndex: ObservableValue<number>;
  onTabSelect: (index: number) => void;
}

export function Tabs({
  adapter,
  style = {},
}: {
  adapter: TabsViewPort;
  style?: React.CSSProperties;
}) {
  const tabs = useAsyncValue(adapter.tabs);
  const activeTabIndex = useAsyncValue(adapter.activeTabIndex);

  return (
    <div style={{ ...styles.tabs, ...style }}>
      <div style={styles.buttons}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => adapter.onTabSelect(index)}
            disabled={index === activeTabIndex}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div style={styles.content}>{tabs[activeTabIndex].getContents()}</div>
    </div>
  );
}
