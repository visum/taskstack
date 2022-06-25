import React from "react";

export interface UtilitiesTabPort {
  clearData(): Promise<void>;
}

export function UtilitiesTab({ adapter }: { adapter: UtilitiesTabPort }) {
  return (
    <button
      onClick={() => {
        if (confirm("Really clear data?")) {
          adapter.clearData();
        }
      }}
    >
      Clear Data
    </button>
  );
}

export function getUtilitiesTab(adapter: UtilitiesTabPort) {
  return <UtilitiesTab adapter={adapter} />;
}
