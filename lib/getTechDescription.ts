import axios from "axios";

/**
 * Fetches a short, human-friendly description for a given technology name from the web.
 * @param techName The name of the technology (e.g., "React", "TypeScript").
 * @returns A short and sweet description of the technology, or a fallback if not found.
 */
export const getTechDescription = async (techName: string): Promise<string> => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();
  try {
    // Use Wikipedia API for a concise summary
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(techName)}`;
    const { data } = await axios.get(apiUrl);
    if (data.extract) {
      // Return the first sentence as a short description
      return data.extract.split('. ')[0] + '.';
    }
  } catch (error) {
    // Fallback: return a generic message
  }
  return `A technology called ${techName}.`;
};
