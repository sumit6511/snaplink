import { z } from 'zod';

// Zod's built-in .url() accepts any scheme Node's URL parser recognizes,
// including javascript:/data: — harmless via an HTTP Location header in
// practice (browsers won't navigate a redirect to those schemes), but a
// shortener still shouldn't store or advertise a target that isn't a
// normal web address.
const httpUrlField = z
  .string()
  .trim()
  .max(2048)
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
  .regex(/^[a-zA-Z0-9_-]+$/, 'Alias may only contain letters, numbers, hyphens and underscores');

const expiresAtField = z.coerce
  .date()
  .refine((date) => date.getTime() > Date.now(), 'Expiration date must be in the future');

export const createLinkSchema = z.object({
  originalUrl: httpUrlField,
  customAlias: aliasField.optional(),
  title: z.string().trim().max(200).optional(),
  expiresAt: expiresAtField.optional(),
});

export const updateLinkSchema = z.object({
  originalUrl: httpUrlField.optional(),
  customAlias: aliasField.nullable().optional(),
  title: z.string().trim().max(200).nullable().optional(),
  expiresAt: expiresAtField.nullable().optional(),
});

export const listLinksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(200).optional(),
});

export const exportLinksQuerySchema = listLinksQuerySchema.pick({ search: true });

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
export type ListLinksQuery = z.infer<typeof listLinksQuerySchema>;
export type ExportLinksQuery = z.infer<typeof exportLinksQuerySchema>;
