import { DateTime } from "luxon";

export function getReminderDueDate(reminder) {
  const due = DateTime.fromJSDate(new Date(reminder.dueDate)).setZone(
    "Europe/Berlin"
  );
  const [hour, minute] = reminder?.time?.split(":").map(Number) || [12, 0];
  return due.set({ hour, minute });
}
