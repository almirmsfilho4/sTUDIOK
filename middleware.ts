import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const securityHeaders = {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.firebaseio.com wss://*.firebaseio.com https://api.resend.com https://identitytoolkit.googleapis.com https://www.googleapis.com https://firestore.googleapis.com https://*.googleapis.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = securityHeaders['Content-Security-Policy'];
  if (cspHeader) {
    response.headers.set('Content-Security-Policy', cspHeader.replace("'self'", `'self' 'nonce-${nonce}' 'strict-dynamic'`));
  }

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'https://estudiok.com.br',
    'https://www.estudiok.com.br',
  ];
  if (origin && !allowedOrigins.some(o => origin.startsWith(o))) {
    return new NextResponse('Invalid origin', { status: 403 });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};