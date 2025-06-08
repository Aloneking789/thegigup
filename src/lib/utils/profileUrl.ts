// Profile URL utilities for generating SEO-friendly public profile URLs

/**
 * Generate a URL-friendly slug from a name
 * @param name - The user's name
 * @returns A URL-friendly slug
 */
export const generateNameSlug = (name: string): string => {
  if (!name) return 'user';
  
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generate a public profile URL
 * @param name - The user's name
 * @param userId - The user's ID
 * @returns A complete public profile URL
 */
export const generatePublicProfileUrl = (name: string, userId: string): string => {
  const nameSlug = generateNameSlug(name);
  return `/profile/${nameSlug}/${userId}`;
};

/**
 * Parse a public profile URL to extract name slug and user ID
 * @param url - The profile URL
 * @returns Object with nameSlug and userId, or null if invalid
 */
export const parsePublicProfileUrl = (url: string): { nameSlug: string; userId: string } | null => {
  const match = url.match(/\/profile\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  
  return {
    nameSlug: match[1],
    userId: match[2]
  };
};

/**
 * Validate if a name slug matches the expected format
 * @param nameSlug - The name slug to validate
 * @param actualName - The actual name to compare against
 * @returns True if the slug is valid for the name
 */
export const validateNameSlug = (nameSlug: string, actualName: string): boolean => {
  const expectedSlug = generateNameSlug(actualName);
  return nameSlug === expectedSlug;
};

/**
 * Generate a shareable profile URL with full domain (for social sharing)
 * @param name - The user's name
 * @param userId - The user's ID
 * @param baseUrl - The base URL of the site (optional, defaults to current origin)
 * @returns A complete shareable URL
 */
export const generateShareableProfileUrl = (
  name: string, 
  userId: string, 
  baseUrl?: string
): string => {
  const profilePath = generatePublicProfileUrl(name, userId);
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}${profilePath}`;
};
