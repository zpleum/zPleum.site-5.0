"use client";

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useRef, useEffect } from 'react';

interface TurnstileCaptchaProps {
    onSuccess: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
    resetTrigger?: number;
}

export default function TurnstileCaptcha({ onSuccess, onError, onExpire, resetTrigger }: TurnstileCaptchaProps) {
    const turnstileRef = useRef<TurnstileInstance>(null);

    // Site Key Logic: Use env variable if provided and not a placeholder, otherwise use the testing key
    const rawSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY;
    const siteKey = rawSiteKey && rawSiteKey !== 'your_cloudflare_turnstile_key' && !rawSiteKey.includes('your_')
        ? rawSiteKey
        : "0x4AAAAAACE8v7gu7uRijkjf";

    const handleSuccess = (token: string) => {
        onSuccess(token);
    };

    const handleError = (error?: Error | unknown) => {
        console.error('Turnstile error:', error);
        if (onError) {
            onError();
        }
    };

    const handleExpire = () => {
        if (onExpire) {
            onExpire();
        }
    };

    // Handle manual resets from parent
    useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            turnstileRef.current?.reset();
        }
    }, [resetTrigger]);

    return (
        <div className="flex justify-center my-6">
            <Turnstile
                ref={turnstileRef}
                siteKey={siteKey}
                onSuccess={handleSuccess}
                onError={handleError}
                onExpire={handleExpire}
                options={{
                    theme: 'auto',
                    size: 'normal',
                }}
            />
        </div>
    );
}

export type { TurnstileCaptchaProps };
