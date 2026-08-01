import { AxiosError, type AxiosResponse } from 'axios';
import { describe, expect, it } from 'vitest';
import { getErrorMessage } from './errorMessage';

function makeAxiosError(response?: Partial<AxiosResponse>): AxiosError {
  return new AxiosError(
    'Request failed with status code 500',
    'ERR_BAD_RESPONSE',
    undefined,
    undefined,
    response as AxiosResponse,
  );
}

describe('getErrorMessage', () => {
  it('prefers the backend-provided message on an Axios error', () => {
    const error = makeAxiosError({ data: { message: 'Invalid email or password' } });
    expect(getErrorMessage(error)).toBe('Invalid email or password');
  });

  it('falls back for an Axios error with no response body (network/gateway failure)', () => {
    // No `response` at all — e.g. a timeout, DNS failure, or a 502 from a
    // proxy with an HTML body instead of JSON. Must NOT leak Axios's own
    // technical message ("Request failed with status code ...").
    const error = makeAxiosError(undefined);
    expect(getErrorMessage(error, 'Could not reach the server.')).toBe(
      'Could not reach the server.',
    );
  });

  it('falls back when the response body has no message field', () => {
    const error = makeAxiosError({ data: {} });
    expect(getErrorMessage(error, 'fallback')).toBe('fallback');
  });

  it('falls back when the response message is an empty string', () => {
    const error = makeAxiosError({ data: { message: '' } });
    expect(getErrorMessage(error, 'fallback')).toBe('fallback');
  });

  it('uses a plain Error instance message', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
  });

  it('uses the default fallback for a completely unknown value', () => {
    expect(getErrorMessage('just a string')).toBe('Something went wrong. Please try again.');
  });
});
