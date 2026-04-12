import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { AdminNotificationProvider } from '@/contexts/AdminNotificationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PageTransition } from '@/components/PageTransition';
import { Toast } from '@/components/Toast';
import NewsletterPopup from '@/components/NewsletterPopup';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import UrgencyBanner from '@/components/UrgencyBanner';
import MarketingScripts from '@/components/MarketingScripts';
import { FloatingTrustBadge } from '@/components/TrustBadges';
import FloatingCTA from '@/components/FloatingCTA';
import MobileBottomNav from '@/components/MobileBottomNav';
import WhatsAppPopup from '@/components/WhatsAppPopup';

import SchemaOrg, { ServiceSchema, FAQSchema } from '@/components/SchemaOrg';
import DynamicMetaTags from '@/components/DynamicMetaTags';
import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: {
    default: 'ESTUDIOK - Criação de Sites, Apps e Sistemas Sob Medida',
    template: '%s | ESTUDIOK',
  },
  description: 'Agência digital especializada em criação de sites, apps mobile e sistemas web. Seu site pronto em 48 horas!',
  keywords: ['criação de sites', 'desenvolvimento web', 'app mobile', 'sistemas web', 'e-commerce', 'marketing digital', 'agência digital', 'desenvolvedor web', 'criar site', 'loja virtual'],
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'ESTUDIOK - Criação de Sites, Apps e Sistemas',
    description: 'Agência digital especializada. Seu site pronto em 48 horas!',
    type: 'website',
    url: 'https://estudiok.com',
    siteName: 'ESTUDIOK',
    locale: 'pt_BR',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ESTUDIOK',
    description: 'Seu site pronto em 48 horas!',
    creator: '@estudiok',
  },
  alternates: {
    canonical: 'https://estudiok.com',
    languages: {
      'pt-BR': 'https://estudiok.com',
      'en': 'https://estudiok.com/en',
    },
  },
  category: 'technology',
  classification: 'Business',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
<head>
    <SchemaOrg />
    <ServiceSchema />
    <FAQSchema />
    <MarketingScripts 
      GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
      META_PIXEL_ID={process.env.NEXT_PUBLIC_META_PIXEL_ID}
      GOOGLE_ADS_ID={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}
      HOTJAR_ID={process.env.NEXT_PUBLIC_HOTJAR_ID}
    />
</head>
<body className="min-h-screen bg-[#000] text-white">
<Analytics />
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AdminNotificationProvider>
            <DynamicMetaTags />
            <PageTransition>
              <UrgencyBanner />
<FloatingTrustBadge />
 <FloatingCTA />
 <ExitIntentPopup>
                {children}
              </ExitIntentPopup>
            </PageTransition>
            <Toast />
            <NewsletterPopup />
          <MobileBottomNav />
          </AdminNotificationProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </body>
    </html>
  );
}
