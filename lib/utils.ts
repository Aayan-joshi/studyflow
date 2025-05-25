import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { techMap } from "@/constants/TechMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDevIconClassName = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();
  return techMap[normalizedTechName] ? `${techMap[normalizedTechName]} colored` : "devicon-devicon-plain colored";
}

import axios from "axios";

/**
 * Fetches a short, human-friendly description for a given technology name from the web.
 * @param techName The name of the technology (e.g., "React", "TypeScript").
 * @returns A short and sweet description of the technology, or a fallback if not found.
 */
export const getTechDescription = async (techName: string): Promise<string> => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();
  const tryWikipedia = async (title: string) => {
    try {
      const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
      const { data } = await axios.get(apiUrl);
      if (data.extract) return data.extract;
    } catch {}
    return null;
  };

  // Try original name
  let summary = await tryWikipedia(techName);

  // If not dev-related, try with dev context
  if (
    !summary ||
    !/programming|software|developer|library|framework|language|tool|code|application/i.test(summary)
  ) {
    summary =
      (await tryWikipedia(`${techName} (programming language)`)) ||
      (await tryWikipedia(`${techName} (software)`)) ||
      (await tryWikipedia(`${techName} (framework)`));
  }

  if (summary) {
    // Return only the first sentence, with dev context if not present
    let firstSentence = summary.split('. ')[0] + '.';
    if (!/programming|software|developer|library|framework|language|tool|code|application/i.test(firstSentence)) {
      firstSentence += ` (For developers: ${techName} is used in software development.)`;
    }
    return firstSentence;
  }

  return `A technology called ${techName}, commonly used in software development.`;
};

export function timeAgo(createdAt: Date): string {
  const date = new Date(createdAt);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;

  return `${Math.floor(seconds)} seconds ago`;
}