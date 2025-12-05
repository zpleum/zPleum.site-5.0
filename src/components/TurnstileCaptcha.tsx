"use client";

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useRef } from 'react';

interface TurnstileCaptchaProps {
    onSuccess: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
}

export default function TurnstileCaptcha({ onSuccess, onError, onExpire }: TurnstileCaptchaProps) {
    const turnstileRef = useRef<TurnstileInstance>(null);

    const handleSuccess = (token: string) => {
        console.log('Turnstile success:', token);
        onSuccess(token);
    };

    const handleError = (error?: Error | unknown) => {
        console.error('Turnstile error:', error);
        if (onError) {
            onError();
        }
    };

    const handleExpire = () => {
        console.log('Turnstile expired');
        if (onExpire) {
            onExpire();
        }
    };

    return (
        <div className="flex justify-center my-6">
            <Turnstile
                ref={turnstileRef}
                siteKey="0x4AAAAAACE8v7gu7uRijkjf"
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
