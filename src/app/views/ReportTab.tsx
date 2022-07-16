import React from "react";
import { ObservableValue } from "../../lib/ObservableValue";
import { useAsyncValue } from "../../lib/useAsyncValue";
import { Task } from "../models/Task";
import { Day } from "../ports/Day";
import { formatTime } from "../lib/formatTime";

export type TaskTotalRecord = Record<number, { task: Task; total: number }>;
export interface ReportTabViewPort {
  totalTasks: ObservableValue<number>;
  totalTime: ObservableValue<number>;
  totalChanges: ObservableValue<number>;
  intervals: ObservableValue<TaskInterval[]>;
  taskTotals: ObservableValue<TaskTotalRecord>;
  handleSelectNextDay(): void;
  handleSelectPreviousDay(): void;
  handleSelectToday(): void;
  day: ObservableValue<Day>;
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
  const dailyTotals = useAsyncValue(adapter.taskTotals);
  const day = useAsyncValue(adapter.day);
  const intervals = useAsyncValue(adapter.intervals);

  const dayFormatted = `${day.year}-${day.month}-${day.day}`;

  return (
    <div style={{ ...styles.reportRoot, ...style }}>
      <div>Report for {dayFormatted}</div>
      <div>
        <button onClick={() => adapter.handleSelectPreviousDay()}>&lt;-</button>
        <button onClick={() => adapter.handleSelectToday()}>Today</button>
        <button onClick={() => adapter.handleSelectNextDay()}>-&gt;</button>
      </div>
      <table>
        <tbody>
          <tr>
            <td>Total Time</td>
            <td>{formatTime(totalTime)}</td>
          </tr>
          <tr>
            <td>Tasks Worked</td>
            <td>{totalTasks}</td>
          </tr>
          <tr>
            <td>Changes</td>
            <td>{totalChanges}</td>
          </tr>
        </tbody>
      </table>
      <h3>Tasks</h3>
      <tbody>
        {Object.values(dailyTotals).map(({ task, total }) => (
          <tr key={task.id}>
            <td>{task.name}</td>
            <td>{formatTime(total)}</td>
          </tr>
        ))}
      </tbody>
      <h3>Intervals</h3>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {intervals.map((interval, index) => (
            <tr key={index}>
              <td>{interval.task.name}</td>
              <td>{formatTime(interval.duration)}</td>
            </tr>
          ))}
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
