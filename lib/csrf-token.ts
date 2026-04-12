import { cookies } from 'next/headers';

const CSRF_TOKEN_LENGTH = 32;

export function generateCSRFToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < CSRF_TOKEN_LENGTH; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function getCSRFToken(): Promise<string> {
  const cookieStore = await cookies();
  let token = cookieStore.get('csrf-token')?.value;

  if (!token) {
    token = generateCSRFToken();
  }

  return token;
}

export async function setCSRFCookie(): Promise<void> {
  const token = generateCSRFToken();
  const cookieStore = await cookies();
  cookieStore.set('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
}

export async function validateCSRFToken(requestToken: string | null): Promise<boolean> {
  if (!requestToken) return false;
  
  const cookieStore = await cookies();
  const storedToken = cookieStore.get('csrf-token')?.value;
  
  if (!storedToken) return false;
  
  return requestToken === storedToken;
}

export function getCSRFHeader(): Record<string, string> {
  return {
    'X-CSRF-Token': 'GET_FROM_COOKIE',
  };
}

export function verifyRequestOrigin(origin: string, allowedOrigins: string[]): boolean {
  try {
    const url = new URL(origin);
    return allowedOrigins.includes(url.origin);
  } catch {
    return false;
  }
}