import { z } from 'zod';

const aliasField = z
  .string()
  .trim()
  .min(3, 'Alias must be at least 3 characters')
  .max(50, 'Alias must be at most 50 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, hyphens and underscores')
  .optional()
  .or(z.literal(''));

export const linkFormSchema = z.object({
  originalUrl: z.string().trim().min(1, 'URL is required').url('Must be a valid URL'),
  customAlias: aliasField,
  title: z.string().trim().max(200).optional().or(z.literal('')),
  expiresAt: z.string().optional().or(z.literal('')),
});

export type LinkFormValues = z.infer<typeof linkFormSchema>;
