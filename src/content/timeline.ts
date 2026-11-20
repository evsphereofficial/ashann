import { ph, type TimelineEntry } from "./types";

/**
 * Six keepsake tokens — one per month.
 * No dates or events are supplied yet, so all six are placeholders.
 */
export const timeline: TimelineEntry[] = [
  {
    id: "month-1",
    month: 1,
    date: ph("date month 1"),
    title: ph("what happened in month 1"),
    note: ph("one line you remember about month 1"),
  },
  {
    id: "month-2",
    month: 2,
    date: ph("date month 2"),
    title: ph("what happened in month 2"),
    note: ph("one line you remember about month 2"),
  },
  {
    id: "month-3",
    month: 3,
    date: ph("date month 3"),
    title: ph("what happened in month 3"),
    note: ph("one line you remember about month 3"),
  },
  {
    id: "month-4",
    month: 4,
    date: ph("date month 4"),
    title: ph("what happened in month 4"),
    note: ph("one line you remember about month 4"),
  },
  {
    id: "month-5",
    month: 5,
    date: ph("date month 5"),
    title: ph("what happened in month 5"),
    note: ph("one line you remember about month 5"),
  },
  {
    id: "month-6",
    month: 6,
    date: ph("date month 6"),
    title: ph("what happened in month 6"),
    note: ph("one line you remember about month 6"),
  },
];
