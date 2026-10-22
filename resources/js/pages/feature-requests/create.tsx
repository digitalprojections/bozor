import { Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/hooks/use-translations';
import BazaarLayout from '@/layouts/bazaar-layout';

export default function FeatureRequestCreate() {
    const { t } = useTranslations();
    const { auth } = usePage().props;
    const signedIn = !!auth.user && !auth.user.is_guest;
    const form = useForm({ title: '', description: '' });

    function submit(event: FormEvent) {
        event.preventDefault();
        if (!signedIn || form.processing) return;
        form.post('/feature-requests', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <BazaarLayout title={t('feature_requests.title')} showTitle>
            <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900">
                <p className="mb-5 text-sm text-slate-600 dark:text-slate-300">
                    {t('feature_requests.intro')}
                </p>
                {signedIn ? (
                    <form
                        onSubmit={submit}
                        className="space-y-5"
                        aria-busy={form.processing}
                    >
                        <div className="space-y-2">
                            <Label htmlFor="request-title">
                                {t('feature_requests.subject')}
                            </Label>
                            <Input
                                id="request-title"
                                name="title"
                                value={form.data.title}
                                onChange={(event) =>
                                    form.setData('title', event.target.value)
                                }
                                required
                                maxLength={160}
                                disabled={form.processing}
                                aria-invalid={!!form.errors.title}
                                aria-describedby="request-title-error"
                            />
                            <InputError
                                id="request-title-error"
                                message={form.errors.title}
                                role="alert"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="request-description">
                                {t('feature_requests.description')}
                            </Label>
                            <p
                                id="request-description-hint"
                                className="text-sm text-slate-500 dark:text-slate-400"
                            >
                                {t('feature_requests.hint')}
                            </p>
                            <Textarea
                                id="request-description"
                                name="description"
                                value={form.data.description}
                                onChange={(event) =>
                                    form.setData(
                                        'description',
                                        event.target.value,
                                    )
                                }
                                required
                                maxLength={5000}
                                disabled={form.processing}
                                className="min-h-40"
                                aria-invalid={!!form.errors.description}
                                aria-describedby="request-description-hint request-description-error"
                            />
                            <InputError
                                id="request-description-error"
                                message={form.errors.description}
                                role="alert"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={
                                form.processing ||
                                !form.data.title.trim() ||
                                !form.data.description.trim()
                            }
                            className="w-full sm:w-auto"
                        >
                            {t(
                                form.processing
                                    ? 'feature_requests.sending'
                                    : 'feature_requests.submit',
                            )}
                        </Button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <p>{t('feature_requests.sign_in_hint')}</p>
                        <Button asChild>
                            <Link href="/feature-requests/login">
                                {t('feature_requests.sign_in')}
                            </Link>
                        </Button>
                    </div>
                )}
            </section>
        </BazaarLayout>
    );
}
