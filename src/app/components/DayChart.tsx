import React, { useRef } from "react";
import { TaskInterval } from "../views/ReportTab";

const allColors = ["#02D1A2", "#02D1A2", "#1802D1", "#BB02D1", "#D10250"];

function drawCanvas(
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  intervals: TaskInterval[],
  range: { start: number; end: number }
) {
  const unusedColors = [...allColors];
  const colors: Record<string, string> = {}; // taskID to color
  const context = canvas.getContext("2d");
  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;
  const rangeDuration = range.end - range.start;

  if (!context) {
    throw new Error("Could not get a context");
  }

  canvas.height = height;
  canvas.width = width;

  const startDate = new Date(range.start);
  const year = startDate.getFullYear();
  const month = startDate.getMonth() + 1;
  const day = startDate.getDate();

  // // normal working day 8-5
  const eightOClockTime = new Date(year, month - 1, day, 8).getTime();
  const seventeenOClockTime = new Date(year, month - 1, day, 17).getTime();
  const eightOClockX =
    ((eightOClockTime - range.start) / rangeDuration) * width;
  const seventeenOClockX =
    ((seventeenOClockTime - range.start) / rangeDuration) * width;

  context.fillStyle = "#00000010";
  context.fillRect(eightOClockX, 0, seventeenOClockX - eightOClockX, height);

  intervals.forEach((interval) => {
    // range.start is the left side, range.end is the right side
    const normalizedStartX = interval.startTime - range.start;
    const normalizedEndX = interval.endTime - range.start;

    const startX = (normalizedStartX / rangeDuration) * width;
    const endX = (normalizedEndX / rangeDuration) * width;

    let color = colors[interval.task.id];
    if (!color) {
      let thisColor = unusedColors.pop();
      if (!thisColor) {
        // reset the list of colors
        unusedColors.push(...allColors);
        thisColor = unusedColors.pop() as string;
      }
      colors[interval.task.id] = thisColor;
      color = thisColor;
    }
    context.fillStyle = color;
    context.fillRect(startX, 0, endX - startX, height);
  });

  // hour ticks
  context.strokeStyle = "#000000";
  context.lineWidth = 1;

  let currentTickTime = new Date(year, month - 1, day, startDate.getHours());
  while (currentTickTime.getTime() < range.end) {
    const currentHour = currentTickTime.getHours();
    const x =
      ((currentTickTime.getTime() - range.start) / rangeDuration) * width;
    let ticHeight = 0.2;
    if (currentHour % 2 === 0) {
      ticHeight = 0.3;
    }
    if (currentHour % 6 === 0) {
      ticHeight = 0.5;
    }

    context.moveTo(x, height);
    context.lineTo(x, height - height * ticHeight);
    context.stroke();
    currentTickTime.setHours(currentHour + 1);
  }
}

export function DayChart({
  intervals,
  style,
  startTime,
  endTime,
}: {
  intervals: TaskInterval[];
  style: React.CSSProperties;
  startTime: number;
  endTime: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (canvasRef.current && containerRef.current) {
    drawCanvas(containerRef.current, canvasRef.current, intervals, {
      start: startTime,
      end: endTime,
    });
  }

  return (
    <div style={style} ref={containerRef}>
      <canvas ref={canvasRef}>Canvas not supported</canvas>
    </div>
  );
}
