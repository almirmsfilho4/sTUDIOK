import { describe, it, expect } from 'vitest';
import { 
  validatePassword, 
  checkCommonPasswords, 
  generateSecurePassword,
  calculatePasswordEntropy 
} from '@/lib/password-validator';

describe('validatePassword', () => {
  it('should accept strong passwords', () => {
    const result = validatePassword('Str0ng!Pass123');
    expect(result.valid).toBe(true);
  });

  it('should reject short passwords', () => {
    const result = validatePassword('short');
    expect(result.valid).toBe(false);
  });

  it('should reject passwords without numbers', () => {
    const result = validatePassword('StrongPassword');
    expect(result.valid).toBe(false);
  });

  it('should reject passwords without special chars', () => {
    const result = validatePassword('Password123');
    expect(result.valid).toBe(false);
  });
});

describe('checkCommonPasswords', () => {
  it('should detect common passwords', () => {
    expect(checkCommonPasswords('password123')).toBe(true);
    expect(checkCommonPasswords('123456')).toBe(true);
  });

  it('should accept uncommon passwords', () => {
    expect(checkCommonPasswords('MyUn1que!P@ss')).toBe(false);
  });
});

describe('generateSecurePassword', () => {
  it('should generate password of correct length', () => {
    const password = generateSecurePassword(16);
    expect(password).toHaveLength(16);
  });

  it('should include different character types', () => {
    const password = generateSecurePassword(16);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%^&*]/);
  });
});

describe('calculatePasswordEntropy', () => {
  it('should return low entropy for simple passwords', () => {
    const entropy = calculatePasswordEntropy('abc');
    expect(entropy).toBeLessThan(20);
  });

  it('should return high entropy for complex passwords', () => {
    const entropy = calculatePasswordEntropy('Str0ng!P@ssw0rd!');
    expect(entropy).toBeGreaterThan(40);
  });
});