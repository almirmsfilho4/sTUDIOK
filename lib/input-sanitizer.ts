export function sanitizeHtml(input: string): string {
 const map: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
 };
 return input.replace(/[&<>"'`/]/g, char => map[char] ?? char);
}

export function sanitizeInput(input: string): string {
  let sanitized = input.trim();
  sanitized = sanitized.replace(/[<>]/g, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+=/gi, '');
  return sanitized;
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().replace(/[^a-z0-9@._-]/g, '');
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (['http:', 'https:'].includes(parsed.protocol)) {
      return parsed.href;
    }
  } catch {
    return '';
  }
  return '';
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.+/g, '.')
    .substring(0, 255);
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function sanitizeObject<T extends Record<string, any>>(obj: T, fields: (keyof T)[]): Partial<T> {
  const sanitized: Partial<T> = {};
  
  for (const field of fields) {
    const value = obj[field];
    if (typeof value === 'string') {
      (sanitized as any)[field] = sanitizeInput(value);
    } else {
      (sanitized as any)[field] = value;
    }
  }
  
  return sanitized;
}

export function validateInput(input: string, type: 'email' | 'phone' | 'url' | 'text'): boolean {
  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    case 'phone':
      return /^\d{10,11}$/.test(input);
    case 'url':
      try {
        new URL(input);
        return true;
      } catch {
        return false;
      }
    case 'text':
      return input.length > 0 && input.length <= 5000;
    default:
      return false;
  }
}

export function removeXSS(input: string): string {
  let output = input;
  
  output = output.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  output = output.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  output = output.replace(/javascript:/gi, '');
  output = output.replace(/on\w+\s*=/gi, '');
  output = output.replace(/data:/gi, '');
  
  return output;
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[^\w\sàáâãéêíóôõúüç-]/gi, '')
    .trim()
    .substring(0, 100);
}

export function isSqlInjectionAttempt(input: string): boolean {
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /(--|#|\/\*|\*\/)/,
    /(\bOR\b\s+\d+\s*=\s*\d+)/i,
    /(\bAND\b\s+\d+\s*=\s*\d+)/i,
    /(EXEC\s*\()/i,
    /(WAITFOR\s+DELAY)/i,
  ];
  
  return patterns.some(pattern => pattern.test(input));
}

export function sanitizeForCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}