import { isAxiosError } from 'axios';

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (isAxiosError(error)) {
    // Only a real backend-provided message is trustworthy to show the user;
    // network errors, timeouts, and gateway failures carry no JSON body, and
    // AxiosError's own .message ("Request failed with status code 502") is
    // technical noise, not something a user should see.
    const message = error.response?.data?.message;
    return typeof message === 'string' && message.length > 0 ? message : fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
