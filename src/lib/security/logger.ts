/**
 * Secure Logging Utilities
 * Production-safe logging that prevents PII exposure
 */

/**
 * Redact sensitive information
 */
function redact(value: unknown): unknown {
  if (typeof value === 'string') {
    // Redact emails
    value = value.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]');
    // Redact phone numbers
    value = value.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE_REDACTED]');
    // Redact API keys
    value = value.replace(/sk-[a-zA-Z0-9]{32,}/g, '[API_KEY_REDACTED]');
    return value;
  }
  
  if (typeof value === 'object' && value !== null) {
    const obj = { ...value } as Record<string, unknown>;
    const sensitiveFields = [
      'email', 'phone', 'phoneNumber', 'fullName', 'name',
      'password', 'token', 'secret', 'apiKey',
    ];
    
    for (const key of Object.keys(obj)) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        obj[key] = '[REDACTED]';
      } else {
        obj[key] = redact(obj[key]);
      }
    }
    return obj;
  }
  
  return value;
}

/**
 * Safe logger that redacts PII
 */
export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    console.log(JSON.stringify({
      level: 'info',
      message: redact(message),
      ...redact(context || {}),
    }));
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message: redact(message),
      ...redact(context || {}),
    }));
  },
  error: (message: string, context?: Record<string, unknown>) => {
    console.error(JSON.stringify({
      level: 'error',
      message: redact(message),
      ...redact(context || {}),
    }));
  },
};

