import { Link } from '@inertiajs/react';
import { useTranslations } from '@/hooks/use-translations';
import BazaarLayout from '@/layouts/bazaar-layout';

type RequestItem = {
    id: number;
    title: string;
    description: string;
    locale: string;
    created_at: string;
};
type Requests = {
    data: RequestItem[];
    prev_page_url: string | null;
    next_page_url: string | null;
};

export default function FeatureRequestInbox({
    requests,
}: {
    requests: Requests;
}) {
    const { t, locale } = useTranslations();
    return (
        <BazaarLayout title={t('feature_requests.inbox')} showTitle>
            <div className="space-y-4">
                {requests.data.length === 0 && (
                    <p className="text-sm">{t('feature_requests.empty')}</p>
                )}
                {requests.data.map((request) => (
                    <article
                        key={request.id}
                        className="min-w-0 space-y-3 rounded-xl border border-slate-200 bg-white p-4 break-words shadow-sm dark:border-slate-700 dark:bg-slate-900"
                    >
                        <h2 className="font-semibold" lang={request.locale}>
                            {request.title}
                        </h2>
                        <p
                            className="text-sm whitespace-pre-wrap"
                            lang={request.locale}
                        >
                            {request.description}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {request.locale.toUpperCase()} ·{' '}
                            <time dateTime={request.created_at}>
                                {new Intl.DateTimeFormat(locale, {
                                    dateStyle: 'medium',
                                }).format(new Date(request.created_at))}
                            </time>
                        </p>
                    </article>
                ))}
                <nav
                    className="flex gap-6 text-sm"
                    aria-label={t('feature_requests.pagination')}
                >
                    {requests.prev_page_url && (
                        <Link
                            href={requests.prev_page_url}
                            className="underline"
                        >
                            {t('feature_requests.previous')}
                        </Link>
                    )}
                    {requests.next_page_url && (
                        <Link
                            href={requests.next_page_url}
                            className="underline"
                        >
                            {t('feature_requests.next')}
                        </Link>
                    )}
                </nav>
            </div>
        </BazaarLayout>
    );
}
