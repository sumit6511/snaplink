import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing Library's own auto-cleanup only registers itself when it detects a
// *global* afterEach — this project deliberately doesn't enable Vitest's
// `globals` option (explicit imports instead), so it's wired by hand here.
afterEach(() => {
  cleanup();
});
