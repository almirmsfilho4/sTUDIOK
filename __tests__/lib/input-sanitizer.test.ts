import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeEmail, sanitizeHtml, validateInput, stripHtml, sanitizePhone, sanitizeUrl, isSqlInjectionAttempt } from '@/lib/input-sanitizer';

describe('sanitizeInput', () => {
  it('should trim whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('should remove javascript: protocol', () => {
    expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
  });

  it('should remove event handlers', () => {
    expect(sanitizeInput('<img onerror="alert(1)">')).toBe('img "alert(1)"');
  });

  it('should remove angle brackets', () => {
    expect(sanitizeInput('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
  });
});

describe('sanitizeEmail', () => {
  it('should convert to lowercase', () => {
    expect(sanitizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com');
  });

  it('should trim whitespace', () => {
    expect(sanitizeEmail('  test@example.com  ')).toBe('test@example.com');
  });

  it('should remove invalid characters', () => {
    expect(sanitizeEmail('test@exa>mple.com')).toBe('test@example.com');
  });
});

describe('sanitizeHtml', () => {
  it('should escape HTML entities', () => {
    expect(sanitizeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('should escape quotes', () => {
    expect(sanitizeHtml('"test"')).toBe('&quot;test&quot;');
  });
});

describe('validateInput', () => {
  it('should validate correct emails', () => {
    expect(validateInput('test@example.com', 'email')).toBe(true);
    expect(validateInput('user.name@domain.org', 'email')).toBe(true);
  });

  it('should validate correct phone', () => {
    expect(validateInput('11999999999', 'phone')).toBe(true);
  });

  it('should validate correct url', () => {
    expect(validateInput('https://example.com', 'url')).toBe(true);
  });
});

describe('sanitizePhone', () => {
  it('should remove non-numeric characters', () => {
    expect(sanitizePhone('(11) 99999-9999')).toBe('11999999999');
  });
});

describe('sanitizeUrl', () => {
  it('should validate URL', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
  });

  it('should reject invalid protocols', () => {
    expect(sanitizeUrl('ftp://example.com')).toBe('');
  });
});

describe('isSqlInjectionAttempt', () => {
  it('should detect SQL injection', () => {
    expect(isSqlInjectionAttempt("'; DROP TABLE users;--")).toBe(true);
    expect(isSqlInjectionAttempt('UNION SELECT * FROM passwords')).toBe(true);
  });

  it('should allow normal input', () => {
    expect(isSqlInjectionAttempt('Hello World')).toBe(false);
    expect(isSqlInjectionAttempt('My name is John')).toBe(false);
  });
});

describe('stripHtml', () => {
  it('should remove HTML tags', () => {
    expect(stripHtml('<p>Hello</p>')).toBe('Hello');
  });
});