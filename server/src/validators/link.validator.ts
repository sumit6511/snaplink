import { z } from 'zod';

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
  originalUrl: z.string().trim().url('Must be a valid URL').max(2048),
  customAlias: aliasField.optional(),
  title: z.string().trim().max(200).optional(),
  expiresAt: expiresAtField.optional(),
});

export const updateLinkSchema = z.object({
  originalUrl: z.string().trim().url('Must be a valid URL').max(2048).optional(),
  customAlias: aliasField.nullable().optional(),
  title: z.string().trim().max(200).nullable().optional(),
  expiresAt: expiresAtField.nullable().optional(),
});

export const listLinksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(200).optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
export type ListLinksQuery = z.infer<typeof listLinksQuerySchema>;
