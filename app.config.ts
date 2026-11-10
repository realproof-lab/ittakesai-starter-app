/**
 * The app's name and wording in one place. Ask Claude to change these first
 * when you turn the tracker into your own tool.
 */
export const APP = {
  name: "Team tracker",
  tagline: "Everything the team is working on, in one list.",
  itemSingular: "item",
  itemPlural: "items",
};

/** The steps an item moves through. Change the labels freely; keep the ids stable. */
export const STATUSES = [
  { id: "todo", label: "To do" },
  { id: "doing", label: "Doing" },
  { id: "done", label: "Done" },
] as const;

export type StatusId = (typeof STATUSES)[number]["id"];
