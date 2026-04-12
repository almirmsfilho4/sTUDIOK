interface RDStationLead {
  email: string;
  name?: string;
  phone?: string;
  empresa?: string;
  cargo?: string;
  tags?: string[];
  custom_fields?: Record<string, string>;
}

interface RDStationConfig {
  token: string;
  url?: string;
}

export async function createRDStationLead(lead: RDStationLead, config: RDStationConfig): Promise<boolean> {
  try {
    const response = await fetch('https://api.rd.services/platform/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.token}`
      },
      body: JSON.stringify({
        email: lead.email,
        name: lead.name,
        phone: lead.phone,
        company: { name: lead.empresa },
        job_title: lead.cargo,
        tags: lead.tags,
        custom_fields: lead.custom_fields
      })
    });

    return response.ok;
  } catch (error) {
    console.error('RD Station error:', error);
    return false;
  }
}

export async function addRDStationTag(email: string, tag: string, token: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.rd.services/platform/contacts/email/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email,
        tag
      })
    });

    return response.ok;
  } catch (error) {
    console.error('RD Station tag error:', error);
    return false;
  }
}

export function trackRDStationEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).rdApi) {
    (window as any).rdApi.push(['track', eventName, eventData]);
  }
}

export function initRDStation(token: string) {
  if (typeof window !== 'undefined') {
    (window as any).rdApi = (window as any).rdApi || [];
    (window as any).rdl = (window as any).rdl || [];
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://d335luupugsy2.cloudfront.net/js/loader-scripts/${token}.js`;
    document.head.appendChild(script);
  }
}