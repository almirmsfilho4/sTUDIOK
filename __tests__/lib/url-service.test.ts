import { describe, it, expect } from 'vitest';
import { 
  slugify, 
  generateSEOUrl, 
  extractSlug, 
  isValidSlug,
  addUTMParams,
  getUTMParams,
  generateMetaDescription,
  canonicalUrl,
  isInternalLink,
  getSocialShareUrl
} from '@/lib/url-service';

describe('slugify', () => {
  it('should convert text to URL-friendly slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('Meu Título Legal')).toBe('meu-titulo-legal');
    expect(slugify('Test@#$%')).toBe('test');
  });

  it('should handle special characters', () => {
    expect(slugify('Olá, Mundo!')).toBe('ola-mundo');
  });
});

describe('generateSEOUrl', () => {
  it('should generate SEO-friendly URL', () => {
    const url = generateSEOUrl('My Blog Post');
    expect(url).toContain('my-blog-post');
  });

  it('should include ID when provided', () => {
    const url = generateSEOUrl('My Post', '123');
    expect(url).toContain('123');
  });
});

describe('extractSlug', () => {
  it('should extract slug from URL', () => {
    expect(extractSlug('/my-blog-post')).toBe('my-blog-post');
  });
});

describe('isValidSlug', () => {
  it('should validate proper slugs', () => {
    expect(isValidSlug('my-blog-post')).toBe(true);
    expect(isValidSlug('valid-slug-123')).toBe(true);
  });

  it('should reject invalid slugs', () => {
    expect(isValidSlug('')).toBe(false);
    expect(isValidSlug('invalid slug')).toBe(false);
  });
});

describe('addUTMParams', () => {
  it('should add UTM parameters', () => {
    const url = addUTMParams('https://example.com', {
      source: 'newsletter',
      medium: 'email',
      campaign: 'sale'
    });
    expect(url).toContain('utm_source=newsletter');
  });
});

describe('getUTMParams', () => {
  it('should extract UTM params from URL', () => {
    const params = getUTMParams('https://example.com?utm_source=fb&utm_medium=social');
    expect(params.source).toBe('fb');
    expect(params.medium).toBe('social');
  });
});

describe('generateMetaDescription', () => {
  it('should truncate content to max length', () => {
    const longText = 'A'.repeat(200);
    const desc = generateMetaDescription(longText, 100);
    expect(desc.length).toBeLessThanOrEqual(100);
  });

  it('should not truncate short content', () => {
    const shortText = 'Short description';
    expect(generateMetaDescription(shortText)).toBe(shortText);
  });
});

describe('canonicalUrl', () => {
  it('should generate canonical URL', () => {
    expect(canonicalUrl('/blog/post')).toContain('/blog/post');
  });
});

describe('isInternalLink', () => {
  it('should detect internal links', () => {
    expect(isInternalLink('/dashboard')).toBe(true);
    expect(isInternalLink('/admin')).toBe(true);
  });

  it('should detect external links', () => {
    expect(isInternalLink('https://google.com')).toBe(false);
  });
});

describe('getSocialShareUrl', () => {
  it('should generate Facebook share URL', () => {
    const url = getSocialShareUrl('facebook', 'https://example.com', 'My Title');
    expect(url).toContain('facebook.com');
  });

  it('should generate Twitter share URL', () => {
    const url = getSocialShareUrl('twitter', 'https://example.com', 'My Title');
    expect(url).toContain('twitter.com');
  });
});