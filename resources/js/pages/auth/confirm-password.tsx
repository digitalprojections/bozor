import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { useTranslations } from '@/hooks/use-translations';

export default function ConfirmPassword() {
    const { t } = useTranslations();

    return (
        <AuthLayout
            title={t('auth.confirm_password_title')}
            description={t('auth.confirm_password_description')}
        >
            <Head title={t('auth.confirm_password')} />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                autoFocus
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button
                                className="w-full"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                {t('auth.confirm_password_button')}
                            </Button>

                            <Button
                                variant="ghost"
                                type="button"
                                className="w-full"
                                onClick={() => window.history.back()}
                            >
                                {t('common.cancel')}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
