interface SecurityLog {
  phone: string;
  action: string;
  timestamp: Date;
  blocked?: boolean;
  reason?: string;
}

const securityLogs: SecurityLog[] = [];
const blockedPhones = new Set<string>();
const suspiciousPatterns = [
  /script/i,
  /javascript/i,
  /\$\{/,
  /eval\(/,
  /document\./,
  /window\./,
  /<[^>]+>/,
];

const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_MESSAGES_PER_WINDOW = 10;
const rateLimitMap = new Map<string, { count: number; firstMessage: number }>();

export function sanitizeInput(input: string): string {
  let sanitized = input;
  suspiciousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  return sanitized.trim().substring(0, 1000);
}

export function checkRateLimit(phone: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const record = rateLimitMap.get(phone);

  if (!record) {
    rateLimitMap.set(phone, { count: 1, firstMessage: now });
    return { allowed: true };
  }

  if (now - record.firstMessage > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(phone, { count: 1, firstMessage: now });
    return { allowed: true };
  }

  if (record.count >= MAX_MESSAGES_PER_WINDOW) {
    return { allowed: false, reason: 'Rate limit exceeded' };
  }

  record.count++;
  return { allowed: true };
}

export function isPhoneBlocked(phone: string): boolean {
  return blockedPhones.has(phone);
}

export function blockPhone(phone: string, reason: string): void {
  blockedPhones.add(phone);
  securityLogs.push({
    phone,
    action: 'blocked',
    timestamp: new Date(),
    blocked: true,
    reason
  });
}

export function logSecurityEvent(phone: string, action: string, blocked?: boolean, reason?: string): void {
  securityLogs.push({
    phone,
    action,
    timestamp: new Date(),
    blocked,
    reason
  });

  if (securityLogs.length > 1000) {
    securityLogs.shift();
  }
}

export function detectInjectionAttempt(message: string): boolean {
  return suspiciousPatterns.some(pattern => pattern.test(message));
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function getSecurityLogs(): SecurityLog[] {
  return [...securityLogs].reverse();
}

export function getBlockedPhones(): string[] {
  return Array.from(blockedPhones);
}
