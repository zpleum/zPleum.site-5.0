"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function TrafficTracker() {
    const pathname = usePathname();
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
        // Only track if the path has actually changed and it's not a static asset/API
        if (pathname !== lastTrackedPath.current && !pathname.includes('.')) {
            trackVisit(pathname);
            lastTrackedPath.current = pathname;
        }
    }, [pathname]);

    const trackVisit = async (path: string) => {
        try {
            // We use a dedicated endpoint to avoid cluttering main logs
            fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path,
                    referer: document.referrer,
                }),
                // use keepalive to ensure the request is sent even if the user navigates away
                keepalive: true
            });
        } catch {
            // Silent fail to not disrupt user experience
        }
    };

    return null;
}
