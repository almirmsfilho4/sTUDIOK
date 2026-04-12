'use client';

import { useEffect } from 'react';

interface MarketingScriptsProps {
  GA_MEASUREMENT_ID?: string;
  META_PIXEL_ID?: string;
  GOOGLE_ADS_ID?: string;
  HOTJAR_ID?: string;
}

export default function MarketingScripts({ 
  GA_MEASUREMENT_ID, 
  META_PIXEL_ID, 
  GOOGLE_ADS_ID,
  HOTJAR_ID
}: MarketingScriptsProps) {
  
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    `;
    document.head.appendChild(script2);
  }, [GA_MEASUREMENT_ID]);

  useEffect(() => {
    if (!META_PIXEL_ID) return;

    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${META_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    (window as any).fbq = (window as any).fbq || function() {};
    (window as any).fbq('track', 'PageView');
  }, [META_PIXEL_ID]);

  useEffect(() => {
    if (!GOOGLE_ADS_ID) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagservices.com/tag/js/gtag?id=${GOOGLE_ADS_ID}`;
    document.head.appendChild(script);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.gtag = function(){dataLayer.push(arguments)};
      gtag('js', new Date());
      gtag('config', '${GOOGLE_ADS_ID}');
    `;
    document.head.appendChild(script2);
  }, [GOOGLE_ADS_ID]);

  useEffect(() => {
    if (!HOTJAR_ID) return;

    (function(h: any, o: any, t: any, j: any, a: any, r: any) {
      h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments) };
      h._hjSettings = { hjid: r, hjsv: a };
      j = o.createElement(t), a = o.getElementsByTagName(t)[0];
      j.async = 1;
      j.src = `https://static.hotjar.com/c/hotjar-${r}.js?sv=${a}`;
      a.parentNode.insertBefore(j, a);
    })(window, document, 'script', 0, '6', HOTJAR_ID);
  }, [HOTJAR_ID]);

  return null;
}

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
    }
    if ((window as any).fbq) {
      const fbEventMap: Record<string, string> = {
        'generate_lead': 'Lead',
        'purchase': 'Purchase',
        'add_to_cart': 'AddToCart',
        'begin_checkout': 'InitiateCheckout',
        'orcamento_submit': 'Lead',
        'orcamento_started': 'Lead',
      };
      const fbEvent = fbEventMap[eventName] || 'CustomEvent';
      (window as any).fbq('track', fbEvent, parameters);
    }
  }
}

export function trackOrcamentoStarted(serviceType: string, estimatedValue?: number) {
  trackEvent('orcamento_started', {
    content_name: serviceType,
    value: estimatedValue,
    currency: 'BRL',
  });
  
  if ((window as any).fbq) {
    (window as any).fbq('track', 'Lead', {
      content_name: serviceType,
      value: estimatedValue,
      currency: 'BRL',
    });
  }
}

export function trackThankYouPage(clientName: string, projectType: string, estimatedValue: number) {
  trackEvent('thank_you_page_viewed', {
    client_name: clientName,
    project_type: projectType,
    value: estimatedValue,
    currency: 'BRL',
  });
  
  if ((window as any).fbq) {
    (window as any).fbq('track', 'Purchase', {
      content_name: `${projectType} - Orçamento`,
      value: estimatedValue,
      currency: 'BRL',
    });
  }
  
  console.log('Thank You Page tracked:', { clientName, projectType, estimatedValue });
}

export function trackConversion(conversionId: string, value?: number) {
  trackEvent('conversion', {
    transaction_id: conversionId,
    value: value,
    currency: 'BRL',
  });
}

// Eventos de conversão específicos para ESTUDIOK
export function trackLeadFormSubmit(formType: string, leadData: Record<string, any>) {
  trackEvent('generate_lead', {
    form_type: formType,
    ...leadData
  });
  
  console.log('Lead form submitted:', { formType, leadData });
}

export function trackPaymentComplete(paymentId: string, amount: number, planType: string) {
  trackEvent('purchase', {
    transaction_id: paymentId,
    value: amount,
    currency: 'BRL',
    items: [{
      item_id: paymentId,
      item_name: `Plano ${planType}`,
      price: amount,
      quantity: 1
    }]
  });
  
  console.log('Payment tracked:', { paymentId, amount, planType });
}

export function trackCalendlyBooking(clientName: string, appointmentType: string) {
  trackEvent('schedule', {
    appointment_type: appointmentType,
    client_name: clientName,
  });
  
  console.log('Calendly booking tracked:', { clientName, appointmentType });
}

export function trackWhatsAppClick(source: string) {
  trackEvent('whatsapp_click', {
    source: source,
  });
  
  console.log('WhatsApp click tracked:', { source });
}