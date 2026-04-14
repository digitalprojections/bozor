import { Link, usePage } from '@inertiajs/react';
import React from 'react';

/**
 * A wrapper around the Inertia Link component that automatically
 * prepends the current locale to any internal href.
 */
export function LocalizedLink({ href, children, ...props }: React.ComponentProps<typeof Link>) {
    const { locale } = usePage().props as any;
    
    // Ensure href is a string for manipulation
    const hrefString = typeof href === 'string' ? href : '';
    
    // Only localize internal links that don't already have the locale prefix
    // and aren't external links (http/https).
    const isInternal = hrefString.startsWith('/') && !hrefString.startsWith('//');
    const hasLocalePrefix = /^\/[a-z]{2}(\/|$)/.test(hrefString);
    
    const localizedHref = (isInternal && !hasLocalePrefix) 
        ? `/${locale}${hrefString === '/' ? '' : hrefString}`
        : href;

    return (
        <Link href={localizedHref} {...props}>
            {children}
        </Link>
    );
}
