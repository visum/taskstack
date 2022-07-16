import { padStart } from "../../lib/padStart";

const SECONDS_IN_DAY = 86400;
const SECONDS_IN_HOUR = 3600;

export function formatTime(time: number) {
  let seconds = Math.floor(time / 1000);
  let days = 0;
  let hours = 0;
  let minutes = 0;

  if (seconds >= SECONDS_IN_DAY) {
    days = Math.floor(seconds / SECONDS_IN_DAY);
    seconds = seconds - days * SECONDS_IN_DAY;
  }

  if (seconds >= SECONDS_IN_HOUR) {
    hours = Math.floor(seconds / SECONDS_IN_HOUR);
    seconds = seconds - hours * SECONDS_IN_HOUR;
  }
  if (seconds >= 60) {
    minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;
  }

  return `${padStart(days, 2, "0")}:${padStart(hours, 2, "0")}:${padStart(
    minutes,
    2,
    "0"
  )}:${padStart(seconds, 2, "0")}`;
}