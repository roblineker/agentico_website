/**
 * Input Sanitization Utilities
 * Sanitizes user input to prevent XSS and injection attacks
 */

/**
 * Sanitize text input - removes all HTML tags and dangerous characters
 * This is a lightweight server-side sanitization that doesn't require jsdom
 */
export function sanitizeText(input: string): string {
  if (!input) return input;
  
  // Remove HTML tags while preserving content
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Decode common HTML entities
  sanitized = sanitized
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&amp;/g, '&');
  
  // Remove any remaining HTML tags (in case they were entity-encoded)
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Remove null bytes and other control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  return sanitized.trim();
}

/**
 * Sanitize URL - ensures it's a valid, safe URL
 */
export function sanitizeUrl(input: string): string {
  if (!input) return input;
  
  try {
    const url = new URL(input);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return '';
    }
    return url.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize an object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      if (key.toLowerCase().includes('url') || key.toLowerCase().includes('website')) {
        sanitized[key as keyof T] = sanitizeUrl(value) as T[keyof T];
      } else {
        sanitized[key as keyof T] = sanitizeText(value) as T[keyof T];
      }
    } else if (Array.isArray(value)) {
      if (value.every(item => typeof item === 'string')) {
        sanitized[key as keyof T] = value.map(sanitizeText).filter(item => item.length > 0) as T[keyof T];
      } else if (value.every(item => typeof item === 'object' && item !== null)) {
        sanitized[key as keyof T] = value.map(item => sanitizeObject(item as Record<string, unknown>)) as T[keyof T];
      }
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key as keyof T] = sanitizeObject(value as Record<string, unknown>) as T[keyof T];
    }
  }
  
  return sanitized;
}

/**
 * Check if input contains potential XSS patterns
 */
export function containsXssPatterns(input: string): boolean {
  if (!input) return false;
  
  const xssPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[\s\S]*?>/gi,
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

