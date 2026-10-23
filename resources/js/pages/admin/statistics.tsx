import { router } from '@inertiajs/react';
import { BarChart3, RefreshCw, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import BazaarLayout from '@/layouts/bazaar-layout';

type MetricSet = Record<string, number | null>;
type Breakdown = { label: string; count: number }[];
type Day = {
    date: string;
    users: number;
    listings: number;
    transactions: number;
    bids: number;
};
type Statistics = {
    generated_at: string;
    range: { days: number; start: string; end: string; timezone: string };
    period: MetricSet;
    previous: MetricSet;
    snapshot: MetricSet;
    visitors: number;
    trend: Day[];
    listing_statuses: Breakdown;
    transaction_statuses: Breakdown;
    report_statuses: Breakdown;
    verification_statuses: Breakdown;
    campaign_statuses: Breakdown;
    request_languages: Breakdown;
    categories: Breakdown;
    regions: Breakdown;
};
const overviewKeys = [
    'users',
    'listings',
    'transactions',
    'completed_value',
    'bids',
    'ad_paid_value',
];
const engagementKeys = [
    'completed',
    'cancelled',
    'buyers',
    'sellers',
    'average_value',
    'bidders',
    'messages',
    'answered',
    'ratings',
    'average_rating',
];
const snapshotKeys = [
    'users',
    'verified_users',
    'disabled_users',
    'listings',
    'auctions',
    'listing_views',
    'feature_requests',
];
const series = ['users', 'listings', 'transactions', 'bids'] as const;
const colors = ['#0d9488', '#2563eb', '#9333ea', '#ea580c'];

export default function AdminStatistics({
    statistics,
}: {
    statistics: Statistics;
}) {
    const { t, locale } = useTranslations();
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const pending = useRef(false);
    const numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    const yen = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'JPY',
        maximumFractionDigits: 0,
    });
    const dates = new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeZone: 'UTC',
    });
    const updated = new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'UTC',
    });
    const date = (value: string) =>
        dates.format(new Date(value + 'T00:00:00Z'));
    const format = (key: string, value: number | null) =>
        value === null
            ? t('stats.unavailable')
            : key.includes('value')
              ? yen.format(value)
              : numbers.format(value);

    useEffect(() => {
        const fail = (event: { preventDefault: () => void }) => {
            if (!pending.current) return;
            event.preventDefault();
            pending.current = false;
            setLoading(false);
            setFailed(true);
        };
        const exception = router.on('exception', fail);
        const invalid = router.on('invalid', (event) => {
            if (event.detail.response.status >= 400) fail(event);
        });
        return () => {
            exception();
            invalid();
        };
    }, []);

    function load(days: number) {
        if (pending.current) return;
        pending.current = true;
        setLoading(true);
        setFailed(false);
        router.get(
            '/admin/statistics',
            { days },
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => setFailed(true),
                onFinish: () => {
                    pending.current = false;
                    setLoading(false);
                },
            },
        );
    }

    function cards(
        keys: string[],
        data: MetricSet,
        prefix: string,
        compare = false,
    ) {
        return keys.map((key) => (
            <div
                key={key}
                className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
                <dt className="text-sm text-slate-600 dark:text-slate-300">
                    {t(prefix + key)}
                </dt>
                <dd className="mt-2 text-2xl font-semibold break-words tabular-nums">
                    {format(key, data[key] ?? null)}
                </dd>
                {compare && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {t('stats.previous')}:{' '}
                        {format(key, statistics.previous[key] ?? null)}
                        <span className="ml-2 tabular-nums">
                            (
                            {Number(data[key]) -
                                Number(statistics.previous[key]) >
                            0
                                ? '+'
                                : ''}
                            {format(
                                key,
                                Number(data[key]) -
                                    Number(statistics.previous[key]),
                            )}
                            )
                        </span>
                    </p>
                )}
            </div>
        ));
    }

    function breakdown(
        title: string,
        rows: Breakdown,
        mode: 'status' | 'literal' | 'language' = 'status',
    ) {
        const maximum = Math.max(1, ...rows.map((row) => row.count));
        return (
            <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h2 className="mb-4 font-semibold">{t(title)}</h2>
                {rows.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {t('stats.empty')}
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {rows.map((row) => (
                            <li key={row.label}>
                                <div className="flex justify-between gap-3 text-sm">
                                    <span className="min-w-0 break-words">
                                        {mode === 'status'
                                            ? t('stats.status.' + row.label)
                                            : mode === 'language'
                                              ? row.label.toUpperCase()
                                              : row.label}
                                    </span>
                                    <span className="shrink-0 tabular-nums">
                                        {numbers.format(row.count)}
                                    </span>
                                </div>
                                <div
                                    className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                                    aria-hidden="true"
                                >
                                    <div
                                        className="h-full rounded-full bg-teal-600"
                                        style={{
                                            width:
                                                (row.count / maximum) * 100 +
                                                '%',
                                        }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        );
    }
    const chartMax = Math.max(
        1,
        ...statistics.trend.flatMap((day) => series.map((key) => day[key])),
    );
    return (
        <BazaarLayout title={t('stats.title')} showTitle>
            <div className="space-y-6" aria-busy={loading}>
                <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
                    <div>
                        <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <ShieldCheck size={16} aria-hidden="true" />
                            {t('stats.private')}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {t('stats.updated')}:{' '}
                            {updated.format(new Date(statistics.generated_at))}{' '}
                            UTC
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <label htmlFor="stats-period" className="text-sm">
                            {t('stats.period')}
                        </label>
                        <select
                            id="stats-period"
                            value={statistics.range.days}
                            disabled={loading}
                            onChange={(event) =>
                                load(Number(event.target.value))
                            }
                            className="h-10 max-w-full rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-600 dark:bg-slate-900"
                        >
                            {[7, 30, 90, 365].map((days) => (
                                <option key={days} value={days}>
                                    {t('stats.days', { days })}
                                </option>
                            ))}
                        </select>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={loading}
                            onClick={() => load(statistics.range.days)}
                        >
                            <RefreshCw
                                size={16}
                                className={loading ? 'animate-spin' : ''}
                                aria-hidden="true"
                            />
                            {t(loading ? 'stats.loading' : 'stats.refresh')}
                        </Button>
                    </div>
                </div>
                {failed && (
                    <div
                        role="alert"
                        className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950 dark:text-red-200"
                    >
                        {t('stats.error')}
                    </div>
                )}
                {loading && (
                    <p role="status" className="text-sm">
                        {t('stats.loading')}
                    </p>
                )}
                <section aria-label={t('stats.period')}>
                    <h2 className="mb-1 text-lg font-semibold">
                        {date(statistics.range.start)} –{' '}
                        {date(statistics.range.end)}
                    </h2>
                    <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                        {t('stats.method')}
                    </p>
                    <dl className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                        {cards(
                            overviewKeys,
                            statistics.period,
                            'stats.metric.',
                            true,
                        )}
                    </dl>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        {t('stats.money_note')}
                    </p>
                </section>

                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <BarChart3 size={20} aria-hidden="true" />
                        {t('stats.daily')}
                    </h2>
                    <div className="my-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                        {series.map((key, index) => (
                            <span key={key} className="flex items-center gap-2">
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: colors[index] }}
                                />
                                {t('stats.metric.' + key)}
                            </span>
                        ))}
                    </div>
                    <svg
                        viewBox="0 0 800 190"
                        role="img"
                        aria-label={t('stats.chart_label')}
                        className="h-48 w-full"
                    >
                        <title>{t('stats.chart_label')}</title>
                        {[0, 0.5, 1].map((ratio) => (
                            <g key={ratio}>
                                <line
                                    x1="40"
                                    y1={165 - ratio * 140}
                                    x2="785"
                                    y2={165 - ratio * 140}
                                    stroke="currentColor"
                                    opacity="0.1"
                                />
                                <text
                                    x="2"
                                    y={169 - ratio * 140}
                                    fontSize="11"
                                    fill="currentColor"
                                >
                                    {numbers.format(
                                        Math.round(chartMax * ratio),
                                    )}
                                </text>
                            </g>
                        ))}
                        {series.map((key, index) => (
                            <polyline
                                key={key}
                                fill="none"
                                stroke={colors[index]}
                                strokeWidth="2.5"
                                strokeDasharray={
                                    index === 0 ? undefined : index + 2 + ' 2'
                                }
                                points={statistics.trend
                                    .map(
                                        (day, i) =>
                                            40 +
                                            (i /
                                                Math.max(
                                                    1,
                                                    statistics.trend.length - 1,
                                                )) *
                                                745 +
                                            ',' +
                                            (165 - (day[key] / chartMax) * 140),
                                    )
                                    .join(' ')}
                            />
                        ))}
                    </svg>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>{date(statistics.range.start)}</span>
                        <span>{date(statistics.range.end)}</span>
                    </div>
                    <details className="mt-4">
                        <summary className="cursor-pointer text-sm font-medium text-teal-700 dark:text-teal-300">
                            {t('stats.table')}
                        </summary>
                        <div className="mt-3 max-h-80 overflow-auto">
                            <table className="w-full text-left text-sm">
                                <caption className="sr-only">
                                    {t('stats.daily')}
                                </caption>
                                <thead className="sticky top-0 bg-white dark:bg-slate-900">
                                    <tr>
                                        <th scope="col" className="p-2">
                                            {t('stats.date')}
                                        </th>
                                        {series.map((key) => (
                                            <th
                                                key={key}
                                                scope="col"
                                                className="p-2 text-right"
                                            >
                                                {t('stats.metric.' + key)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {statistics.trend.map((day) => (
                                        <tr
                                            key={day.date}
                                            className="border-t border-slate-100 dark:border-slate-800"
                                        >
                                            <th
                                                scope="row"
                                                className="p-2 font-normal whitespace-nowrap"
                                            >
                                                {date(day.date)}
                                            </th>
                                            {series.map((key) => (
                                                <td
                                                    key={key}
                                                    className="p-2 text-right tabular-nums"
                                                >
                                                    {numbers.format(day[key])}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </details>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-semibold">
                        {t('stats.engagement')}
                    </h2>
                    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {cards(
                            engagementKeys,
                            statistics.period,
                            'stats.metric.',
                        )}
                    </dl>
                </section>
                <div className="grid gap-4 xl:grid-cols-2">
                    {breakdown(
                        'stats.transactions',
                        statistics.transaction_statuses,
                    )}
                    {breakdown(
                        'stats.categories',
                        statistics.categories,
                        'literal',
                    )}
                    {breakdown('stats.regions', statistics.regions, 'literal')}
                    {breakdown(
                        'stats.languages',
                        statistics.request_languages,
                        'language',
                    )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('stats.category_note')}
                </p>
                <section>
                    <h2 className="mb-1 text-lg font-semibold">
                        {t('stats.snapshot')}
                    </h2>
                    <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                        {t('stats.snapshot_note')}
                    </p>
                    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {cards(
                            snapshotKeys,
                            statistics.snapshot,
                            'stats.snapshot.',
                        )}
                    </dl>
                </section>
                <div className="grid gap-4 xl:grid-cols-2">
                    {breakdown('stats.listings', statistics.listing_statuses)}
                    {breakdown('stats.reports', statistics.report_statuses)}
                    {breakdown(
                        'stats.verifications',
                        statistics.verification_statuses,
                    )}
                    {breakdown('stats.campaigns', statistics.campaign_statuses)}
                </div>
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <h2 className="font-semibold">{t('stats.traffic')}</h2>
                    <p className="my-2 text-3xl font-semibold tabular-nums">
                        {numbers.format(statistics.visitors)}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        {t('stats.visitors_note')}
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {t('stats.traffic_unavailable')}
                    </p>
                </section>
            </div>
        </BazaarLayout>
    );
}
