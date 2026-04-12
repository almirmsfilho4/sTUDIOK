export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very_strong';
  score: number;
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
  maxLength: number;
}

export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
  maxLength: 128,
};

export function validatePassword(
  password: string,
  requirements: PasswordRequirements = DEFAULT_PASSWORD_REQUIREMENTS
): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  if (password.length < requirements.minLength) {
    errors.push(`Senha deve ter pelo menos ${requirements.minLength} caracteres`);
  } else {
    score += 20;
  }

  if (password.length > requirements.maxLength) {
    errors.push(`Senha deve ter no máximo ${requirements.maxLength} caracteres`);
  }

  if (requirements.requireUppercase) {
    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    } else {
      score += 15;
    }
  }

  if (requirements.requireLowercase) {
    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    } else {
      score += 15;
    }
  }

  if (requirements.requireNumber) {
    if (!/[0-9]/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    } else {
      score += 15;
    }
  }

  if (requirements.requireSpecial) {
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Senha deve conter pelo menos um caractere especial');
    } else {
      score += 20;
    }
  }

  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 5;

  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) score += 10;

  let strength: PasswordValidationResult['strength'];
  if (score >= 80) strength = 'very_strong';
  else if (score >= 60) strength = 'strong';
  else if (score >= 40) strength = 'medium';
  else strength = 'weak';

  return {
    valid: errors.length === 0,
    errors,
    strength,
    score: Math.min(score, 100),
  };
}

export function getStrengthColor(strength: PasswordValidationResult['strength']): string {
  switch (strength) {
    case 'very_strong': return '#22C55E';
    case 'strong': return '#10B981';
    case 'medium': return '#F59E0B';
    case 'weak': return '#EF4444';
  }
}

export function getStrengthLabel(strength: PasswordValidationResult['strength']): string {
  switch (strength) {
    case 'very_strong': return 'Muito Forte';
    case 'strong': return 'Forte';
    case 'medium': return 'Média';
    case 'weak': return 'Fraca';
  }
}

export function generateSecurePassword(length = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const all = uppercase + lowercase + numbers + special;

  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export function checkCommonPasswords(password: string): boolean {
  const common = [
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
    'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
    'ashley', 'bailey', 'passw0rd', 'shadow', '123123', '654321', 'superman',
    'qazwsx', 'michael', 'football', 'password1', 'password123', 'estudiok',
  ];
  return common.includes(password.toLowerCase());
}

export function calculatePasswordEntropy(password: string): number {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

  if (charsetSize === 0) return 0;
  return Math.floor(password.length * Math.log2(charsetSize));
}