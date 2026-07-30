import { z } from 'zod';

// Matches the backend's restriction to http(s) — Zod's plain .url() would
// otherwise also accept javascript:/data: URIs, which a link shortener
// shouldn't store as a redirect target.
const httpUrlField = z
  .string()
  .trim()
  .min(1, 'URL is required')
  .refine((value) => {
    try {
      const protocol = new URL(value).protocol;
      return protocol === 'http:' || protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Must be a valid http:// or https:// URL');

const aliasField = z
  .string()
  .trim()
  .min(3, 'Alias must be at least 3 characters')
  .max(50, 'Alias must be at most 50 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, hyphens and underscores')
  .optional()
  .or(z.literal(''));

export const linkFormSchema = z.object({
  originalUrl: httpUrlField,
  customAlias: aliasField,
  title: z.string().trim().max(200).optional().or(z.literal('')),
  expiresAt: z.string().optional().or(z.literal('')),
});

export type LinkFormValues = z.infer<typeof linkFormSchema>;
