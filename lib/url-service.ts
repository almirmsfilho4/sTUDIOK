export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function generateSEOUrl(title: string, id?: string): string {
  const slug = slugify(title);
  return id ? `/p/${id}/${slug}` : `/${slug}`;
}

export function extractSlug(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 1] || '';
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function addUTMParams(url: string, params: { source: string; medium: string; campaign: string }): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}utm_source=${params.source}&utm_medium=${params.medium}&utm_campaign=${params.campaign}`;
}

export function getUTMParams(url: string): { source?: string; medium?: string; campaign?: string } {
  try {
    const urlObj = new URL(url);
    return {
      source: urlObj.searchParams.get('utm_source') || undefined,
      medium: urlObj.searchParams.get('utm_medium') || undefined,
      campaign: urlObj.searchParams.get('utm_campaign') || undefined,
    };
  } catch {
    return {};
  }
}

export function shortUrl(longUrl: string): string {
  return `https://estudiok.com/${Math.random().toString(36).substring(2, 8)}`;
}

export function generateMetaDescription(content: string, maxLength: number = 160): string {
  const clean = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength - 3) + '...';
}

export function getOpenGraphImage(title: string): string {
  const slug = slugify(title);
  return `https://estudiak.com/og/${slug}.png`;
}

export function canonicalUrl(path: string): string {
  const baseUrl = 'https://estudiak.com';
  return `${baseUrl}${path.replace(/\/$/, '')}`;
}

export function generateBreadcrumb(items: { name: string; url: string }[]): string {
  return items.map((item, index) => {
    const position = index + 1;
    return `${position}. ${item.name}: ${item.url}`;
  }).join(' > ');
}

export function isInternalLink(url: string): boolean {
  return url.startsWith('/') || url.startsWith('https://estudiak.com') || url.startsWith('https://www.estudiak.com');
}

export function getSocialShareUrl(platform: string, url: string, title: string): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (platform) {
    case 'facebook':
      return `https://facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case 'whatsapp':
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    case 'email':
      return `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
    default:
      return url;
  }
}