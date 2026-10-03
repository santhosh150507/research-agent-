import { Level, Paper } from "./types";

// Render any possibly-null value as "Information unavailable."
export function formatNullable(
  val: string | number | boolean | null | undefined
): string {
  if (val === null || val === undefined || val === "") {
    return "Information unavailable.";
  }
  return String(val);
}

export function formatLevel(level: Level): string {
  return level;
}

export function formatAuthors(
  authors: { id: number; name: string }[] | null | undefined
): string {
  if (!authors || authors.length === 0) return "Information unavailable.";
  return authors.map((a) => a.name).join(", ");
}

export function formatAuthorStrings(
  authors: string[] | null | undefined
): string {
  if (!authors || authors.length === 0) return "Information unavailable.";
  return authors.join(", ");
}

export function formatYear(year: number | null | undefined): string {
  if (year === null || year === undefined) return "Information unavailable.";
  return String(year);
}

export function formatCitationCount(
  count: number | null | undefined
): string {
  if (count === null || count === undefined) return "Information unavailable.";
  return count.toLocaleString();
}

export function formatOpenAccess(val: boolean | null | undefined): string {
  if (val === null || val === undefined) return "Information unavailable.";
  return val ? "Open Access" : "Restricted";
}

export function getSourceLabel(
  source: Paper["source"] | null | undefined
): string {
  switch (source) {
    case "demo": return "Demo";
    case "openalex": return "OpenAlex";
    case "semantic_scholar": return "Semantic Scholar";
    case "arxiv": return "arXiv";
    case "upload": return "Uploaded";
    default: return "Unknown";
  }
}

export function getSourceColor(
  source: Paper["source"] | null | undefined
): string {
  switch (source) {
    case "openalex": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    case "semantic_scholar": return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
    case "arxiv": return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
    case "upload": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

export function truncateAbstract(abstract: string | null, maxLen = 200): string {
  if (!abstract) return "Information unavailable.";
  if (abstract.length <= maxLen) return abstract;
  return abstract.slice(0, maxLen).trimEnd() + "…";
}
