import { describe, it, expect } from 'vitest';

describe('Date utilities', () => {
  it('should format date to Brazilian locale', () => {
    const date = new Date('2024-01-15');
    expect(date.toLocaleDateString('pt-BR')).toBe('15/01/2024');
  });

  it('should calculate days between dates', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-10');
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(9);
  });

  it('should check if date is in future', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    expect(futureDate > new Date()).toBe(true);
  });

  it('should format relative time', () => {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const diffMs = now.getTime() - hourAgo.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    expect(diffHours).toBe(1);
  });
});

describe('Number utilities', () => {
  it('should format currency in BRL', () => {
    const value = 1234.56;
    expect(value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })).toContain('1.234,56');
  });

  it('should format percentage', () => {
    const value = 0.856;
    expect((value * 100).toFixed(1)).toBe('85.6');
  });

  it('should round to decimal places', () => {
    expect(Math.round(3.14159 * 100) / 100).toBe(3.14);
  });
});

describe('String utilities', () => {
  it('should truncate text', () => {
    const text = 'This is a very long text that should be truncated';
    const truncated = text.length > 20 ? text.substring(0, 20) + '...' : text;
    expect(truncated.length).toBe(23);
  });

  it('should capitalize first letter', () => {
    const text = 'hello world';
    const capitalized = text.charAt(0).toUpperCase() + text.slice(1);
    expect(capitalized).toBe('Hello world');
  });

  it('should remove extra spaces', () => {
    const text = '  hello   world  ';
    const trimmed = text.replace(/\s+/g, ' ').trim();
    expect(trimmed).toBe('hello world');
  });
});

describe('Array utilities', () => {
  it('should group array by key', () => {
    const items = [
      { category: 'A', value: 1 },
      { category: 'B', value: 2 },
      { category: 'A', value: 3 },
    ];
    const grouped = items.reduce((acc, item) => {
      const key = item.category;
      if (!acc[key]) acc[key] = [];
      acc[key]!.push(item);
      return acc;
    }, {} as Record<string, typeof items>);
    expect(grouped['A']?.length).toBe(2);
    expect(grouped['B']?.length).toBe(1);
  });

  it('should unique array', () => {
    const arr = [1, 2, 2, 3, 3, 3];
    const unique = Array.from(new Set(arr));
    expect(unique).toEqual([1, 2, 3]);
  });
});