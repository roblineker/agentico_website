"use client";

import { useRef, useCallback } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface CaptchaProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

export function Captcha({ onVerify, onError, onExpire }: CaptchaProps) {
  const captchaRef = useRef<HCaptcha>(null);
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  const handleVerify = useCallback((token: string) => {
    onVerify(token);
  }, [onVerify]);

  const handleError = useCallback(() => {
    onError?.();
  }, [onError]);

  const handleExpire = useCallback(() => {
    onExpire?.();
  }, [onExpire]);

  if (!siteKey) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="border-2 border-dashed border-yellow-500 bg-yellow-50 dark:bg-yellow-950 p-4 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>Dev Mode:</strong> CAPTCHA disabled (set NEXT_PUBLIC_HCAPTCHA_SITE_KEY)
          </p>
          <button
            type="button"
            onClick={() => onVerify('dev-bypass-token')}
            className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 underline"
          >
            Bypass CAPTCHA (dev only)
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex justify-center">
      <HCaptcha
        ref={captchaRef}
        sitekey={siteKey}
        onVerify={handleVerify}
        onError={handleError}
        onExpire={handleExpire}
      />
    </div>
  );
}

