/**
 * Escapes regex metacharacters so user-supplied search text is treated as a
 * literal substring match instead of an arbitrary (and potentially
 * catastrophic-backtracking) regular expression.
 */
export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
