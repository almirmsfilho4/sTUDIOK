interface TrackingEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

interface UserProperties {
  userId?: string;
  userType?: 'lead' | 'customer' | 'visitor';
  acquisitionSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

class TrackingManager {
  private static instance: TrackingManager;
  private eventsQueue: TrackingEvent[] = [];
  private maxQueueSize = 100;
  private isInitialized = false;
  
  private constructor() {
    this.initialize();
  }
  
  static getInstance(): TrackingManager {
    if (!TrackingManager.instance) {
      TrackingManager.instance = new TrackingManager();
    }
    return TrackingManager.instance;
  }
  
  private initialize() {
    if (typeof window !== 'undefined') {
      this.setupGoogleAnalytics();
      this.setupFacebookPixel();
      this.flushQueue();
      this.isInitialized = true;
    }
  }
  
  private setupGoogleAnalytics() {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    
    if (!measurementId || !window.gtag) return;
    
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      send_page_view: true
    });
    
    console.log('Google Analytics initialized');
  }
  
  private setupFacebookPixel() {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    
    if (!pixelId || !window.fbq) return;
    
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
    
    console.log('Facebook Pixel initialized');
  }
  
  private sendToGoogleAnalytics(event: TrackingEvent) {
    if (!window.gtag || !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      return false;
    }
    
    try {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.properties
      });
      return true;
    } catch (error) {
      console.error('Google Analytics tracking error:', error);
      return false;
    }
  }
  
  private sendToFacebookPixel(event: TrackingEvent) {
    if (!window.fbq || !process.env.NEXT_PUBLIC_META_PIXEL_ID) {
      return false;
    }
    
    try {
      let eventName = this.mapEventToFacebook(event.action);
      
      window.fbq('track', eventName, {
        content_category: event.category,
        content_name: event.label,
        value: event.value,
        currency: 'BRL',
        ...event.properties
      });
      return true;
    } catch (error) {
      console.error('Facebook Pixel tracking error:', error);
      return false;
    }
  }
  
  private mapEventToFacebook(action: string): string {
    const mapping: Record<string, string> = {
      'page_view': 'PageView',
      'lead_form_submit': 'Lead',
      'checkout_start': 'InitiateCheckout',
      'purchase': 'Purchase',
      'add_to_cart': 'AddToCart',
      'view_content': 'ViewContent',
      'search': 'Search',
      'contact': 'Contact',
      'click_button': 'CustomizeProduct',
      'share': 'Share',
      'download': 'CompleteRegistration'
    };
    
    return mapping[action] || action;
  }
  
  private sendToCustomEndpoint(event: TrackingEvent) {
    try {
      fetch('/api/tracking/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`
        })
      }).catch(error => {
        console.error('Custom tracking endpoint error:', error);
      });
      
      return true;
    } catch (error) {
      console.error('Custom tracking error:', error);
      return false;
    }
  }
  
  track(event: TrackingEvent) {
    const fullEvent = {
      ...event,
      timestamp: Date.now()
    };
    
    this.eventsQueue.push(fullEvent);
    
    if (this.eventsQueue.length > this.maxQueueSize) {
      this.eventsQueue.shift();
    }
    
    if (!this.isInitialized && typeof window !== 'undefined') {
      setTimeout(() => {
        this.sendEvent(fullEvent);
      }, 100);
      return;
    }
    
    this.sendEvent(fullEvent);
  }
  
  private sendEvent(event: TrackingEvent) {
    if (typeof window === 'undefined') return;
    
    const results = {
      ga: this.sendToGoogleAnalytics(event),
      fb: this.sendToFacebookPixel(event),
      custom: this.sendToCustomEndpoint(event)
    };
    
    if (!results.ga && !results.fb && !results.custom) {
      console.warn('No tracking services available for event:', event);
    }
  }
  
  trackPageView(path?: string) {
    const pagePath = path || window.location.pathname;
    const pageTitle = document.title;
    
    this.track({
      category: 'engagement',
      action: 'page_view',
      label: pagePath,
      properties: {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: pagePath
      }
    });
  }
  
  trackButtonClick(buttonName: string, section?: string) {
    this.track({
      category: 'engagement',
      action: 'click_button',
      label: buttonName,
      properties: {
        section: section,
        button_text: buttonName
      }
    });
  }
  
  trackFormSubmit(formName: string, fields?: string[]) {
    this.track({
      category: 'conversion',
      action: 'form_submit',
      label: formName,
      properties: {
        form_name: formName,
        fields_count: fields?.length || 0
      }
    });
  }
  
  trackLeadGeneration(source: string, type: string = 'contact') {
    this.track({
      category: 'conversion',
      action: 'lead_generated',
      label: source,
      value: 1,
      properties: {
        lead_type: type,
        source: source,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  trackCheckoutStart(amount: number, items: number) {
    this.track({
      category: 'ecommerce',
      action: 'checkout_start',
      label: 'Checkout Initiated',
      value: amount,
      properties: {
        currency: 'BRL',
        items_count: items,
        total_value: amount
      }
    });
  }
  
  trackPurchase(transactionId: string, amount: number, items: any[]) {
    this.track({
      category: 'ecommerce',
      action: 'purchase',
      label: transactionId,
      value: amount,
      properties: {
        transaction_id: transactionId,
        currency: 'BRL',
        items: items,
        tax: amount * 0.1,
        shipping: 0
      }
    });
  }
  
  trackSocialShare(platform: string, content: string) {
    this.track({
      category: 'social',
      action: 'share',
      label: platform,
      properties: {
        platform: platform,
        content_type: content
      }
    });
  }
  
  trackFileDownload(fileName: string, fileType: string) {
    this.track({
      category: 'engagement',
      action: 'file_download',
      label: fileName,
      properties: {
        file_name: fileName,
        file_type: fileType
      }
    });
  }
  
  trackVideoPlay(videoTitle: string, duration: number) {
    this.track({
      category: 'engagement',
      action: 'video_play',
      label: videoTitle,
      value: duration,
      properties: {
        video_title: videoTitle,
        duration: duration
      }
    });
  }
  
  setUserProperties(properties: UserProperties) {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    
    if (window.gtag && measurementId && properties.userId) {
      window.gtag('config', measurementId, {
        user_id: properties.userId,
        user_properties: {
          user_type: properties.userType,
          acquisition_source: properties.acquisitionSource,
          utm_source: properties.utmSource,
          utm_medium: properties.utmMedium,
          utm_campaign: properties.utmCampaign
        }
      });
    }
    
    if (window.fbq && properties.userId) {
      window.fbq('init', process.env.NEXT_PUBLIC_META_PIXEL_ID!, {
        em: properties.userId,
        fn: properties.userType,
        external_id: properties.userId
      });
    }
  }
  
  flushQueue() {
    const queue = [...this.eventsQueue];
    this.eventsQueue = [];
    
    queue.forEach(event => {
      this.sendEvent(event);
    });
  }
  
  getEvents() {
    return [...this.eventsQueue];
  }
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}

export const tracking = TrackingManager.getInstance();

export function useTracking() {
  return tracking;
}

export function trackEvent(event: TrackingEvent) {
  return tracking.track(event);
}

export function trackPageView(path?: string) {
  return tracking.trackPageView(path);
}

export function trackButtonClick(buttonName: string, section?: string) {
  return tracking.trackButtonClick(buttonName, section);
}

export function trackFormSubmit(formName: string, fields?: string[]) {
  return tracking.trackFormSubmit(formName, fields);
}

export function trackLeadGeneration(source: string, type?: string) {
  return tracking.trackLeadGeneration(source, type);
}