import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslations } from '@/hooks/use-translations';
import { login as loginRoute } from '@/routes';
import auth from '@/routes/auth';
import { store as registerStore } from '@/routes/register';

export default function Register() {
    const { t } = useTranslations();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        postal_code: '',
        prefecture: '',
        city: '',
        address_line1: '',
        address_line2: '',
        phone: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(registerStore.url(), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title={t('Create an account')}
            description={t('Enter your details below to create your account')}
        >
            <Head title={t('Register')} />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">{t('Name')}</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            placeholder={t('Full name')}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('Email address')}</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            tabIndex={2}
                            autoComplete="email"
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">{t('Password')}</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            placeholder={t('Password')}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            {t('Confirm password')}
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            placeholder={t('Confirm password')}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="postal_code">{t('Postal Code')}</Label>
                            <Input
                                id="postal_code"
                                name="postal_code"
                                value={data.postal_code}
                                onChange={(e) => setData('postal_code', e.target.value)}
                                required
                                tabIndex={5}
                                autoComplete="postal-code"
                            />
                            <InputError message={errors.postal_code} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="prefecture">{t('Prefecture')}</Label>
                            <Input
                                id="prefecture"
                                name="prefecture"
                                value={data.prefecture}
                                onChange={(e) => setData('prefecture', e.target.value)}
                                required
                                tabIndex={6}
                                autoComplete="address-level1"
                            />
                            <InputError message={errors.prefecture} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="city">{t('City')}</Label>
                            <Input
                                id="city"
                                name="city"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                required
                                tabIndex={7}
                                autoComplete="address-level2"
                            />
                            <InputError message={errors.city} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">{t('Phone')}</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                                tabIndex={8}
                                autoComplete="tel"
                            />
                            <InputError message={errors.phone} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address_line1">{t('Address Line 1')}</Label>
                        <Input
                            id="address_line1"
                            name="address_line1"
                            value={data.address_line1}
                            onChange={(e) => setData('address_line1', e.target.value)}
                            required
                            tabIndex={9}
                            autoComplete="address-line1"
                        />
                        <InputError message={errors.address_line1} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address_line2">{t('Address Line 2')}</Label>
                        <Input
                            id="address_line2"
                            name="address_line2"
                            value={data.address_line2}
                            onChange={(e) => setData('address_line2', e.target.value)}
                            tabIndex={10}
                            autoComplete="address-line2"
                        />
                        <InputError message={errors.address_line2} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full cursor-pointer"
                        tabIndex={11}
                        disabled={processing}
                        data-test="register-user-button"
                    >
                        {processing && <Spinner />}
                        {t('Create account')}
                    </Button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            {t('Or continue with')}
                        </span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    type="button"
                    className="w-full cursor-pointer"
                    onClick={() => (window.location.href = auth.google.url())}
                >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    {t('auth.login_with_google')}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                    {t('Already have an account?')}{' '}
                    <TextLink href={loginRoute()} tabIndex={12}>
                        {t('Log in')}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
