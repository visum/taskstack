import React from "react";
import { ObservableValue } from "../../lib/ObservableValue";
import { useAsyncValue } from "../../lib/useAsyncValue";
import { Task } from "../models/Task";

export interface ReportTabViewPort {
  totalTasks: ObservableValue<number>;
  totalTime: ObservableValue<number>;
  totalChanges: ObservableValue<number>;
  intervals: ObservableValue<TaskInterval[]>;
}

export interface TaskInterval {
  task: Task;
  startTime: number;
  endTime: number;
  duration: number;
}

const styles = {
  reportRoot: {},
};

export function ReportTab({
  adapter,
  style = {},
}: {
  adapter: ReportTabViewPort;
  style?: React.CSSProperties;
}) {
  const totalTasks = useAsyncValue(adapter.totalTasks);
  const totalTime = useAsyncValue(adapter.totalTime);
  const totalChanges = useAsyncValue(adapter.totalChanges);

  return (
    <div style={{ ...styles.reportRoot, ...style }}>
      <div>Report</div>
      <table>
        <tbody>
          <tr>
            <td>Tasks</td>
            <td>{totalTasks}</td>
          </tr>
          <tr>
            <td>Time</td>
            <td>{Task.formatTime(totalTime)}</td>
          </tr>
          <tr>
            <td>Changes</td>
            <td>{totalChanges}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function getReport(
  adapter: ReportTabViewPort,
  style: React.CSSProperties = {}
) {
  return <ReportTab adapter={adapter} style={style} />;
}
