import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Make testing-library matchers available globally
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeInTheDocument(): void;
      toHaveTextContent(text: string | RegExp): void;
      toHaveAttribute(attr: string, value?: string): void;
    }
  }
}

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
} as any;

// Mock sessionStorage
global.sessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
} as any;

// Mock navigator
global.navigator = {
  userAgent: 'node.js',
} as any;