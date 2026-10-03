import { Level } from "./types";

export function formatLevel(level: Level): string {
  return level;
}

export function formatNullable(val: string | number | null | undefined): string {
  if (val === null || val === undefined || val === "") return "Information unavailable.";
  return String(val);
}

export function formatAuthors(authors: string[] | undefined | null): string {
  if (!authors || authors.length === 0) return "Information unavailable.";
  return authors.join(", ");
}

export function formatYear(year: number | undefined | null): string {
  if (!year) return "Information unavailable.";
  return String(year);
}
