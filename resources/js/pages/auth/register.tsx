import { Head, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-translations';
import AuthLayout from '@/layouts/auth-layout';
import type { AddressFields, PostalAddress } from '@/lib/postal-address';
import {
    lookupPostalAddresses,
    mergePostalAddress,
    normalizePostalCode,
} from '@/lib/postal-address';
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

    const [lookupStatus, setLookupStatus] = useState<
        'idle' | 'loading' | 'success' | 'unavailable' | 'error' | 'choose'
    >('idle');
    const [addressChoices, setAddressChoices] = useState<PostalAddress[]>([]);
    const request = useRef<AbortController | null>(null);
    const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lookupStart = useRef<AddressFields>(data);
    const previousTown = useRef('');

    useEffect(
        () => () => {
            request.current?.abort();
            if (debounce.current) clearTimeout(debounce.current);
        },
        [],
    );

    const applyAddress = (address: PostalAddress, started: AddressFields) => {
        const town = previousTown.current;
        setData((current) =>
            mergePostalAddress(current, started, address, town),
        );
        previousTown.current = address.town;
        setLookupStatus('success');
    };

    const changePostalCode = (value: string) => {
        setData('postal_code', value);
        request.current?.abort();
        if (debounce.current) clearTimeout(debounce.current);
        setAddressChoices([]);
        setLookupStatus('idle');
        const code = normalizePostalCode(value);
        if (!code) return;
        const controller = new AbortController();
        request.current = controller;
        const started = { ...data };
        lookupStart.current = started;
        setLookupStatus('loading');
        debounce.current = setTimeout(async () => {
            try {
                const addresses = await lookupPostalAddresses(
                    code,
                    AbortSignal.any([
                        controller.signal,
                        AbortSignal.timeout(8000),
                    ]),
                );
                if (controller.signal.aborted) return;
                if (addresses.length === 0) setLookupStatus('unavailable');
                else if (addresses.length === 1)
                    applyAddress(addresses[0], started);
                else {
                    setAddressChoices(addresses);
                    setLookupStatus('choose');
                }
            } catch {
                if (!controller.signal.aborted) setLookupStatus('error');
            }
        }, 350);
    };

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
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            required
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
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                            autoComplete="new-password"
                            placeholder={t('Confirm password')}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="grid items-start gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="postal_code">
                                {t('Postal Code')}
                            </Label>
                            <Input
                                id="postal_code"
                                name="postal_code"
                                value={data.postal_code}
                                onChange={(e) =>
                                    changePostalCode(e.target.value)
                                }
                                required
                                autoComplete="postal-code"
                                inputMode="numeric"
                                aria-describedby="postal-lookup-status"
                                aria-busy={lookupStatus === 'loading'}
                            />
                            <InputError message={errors.postal_code} />
                            <p
                                id="postal-lookup-status"
                                role="status"
                                className="text-sm text-muted-foreground"
                            >
                                {t(`registration.postal.${lookupStatus}`)}
                            </p>
                            {addressChoices.length > 1 && (
                                <div className="grid gap-2">
                                    <Label htmlFor="postal_address">
                                        {t('registration.postal.choose_label')}
                                    </Label>
                                    <select
                                        id="postal_address"
                                        className="w-full min-w-0 rounded-md border bg-background p-2 text-sm"
                                        defaultValue=""
                                        onChange={(event) => {
                                            const address =
                                                addressChoices[
                                                    Number(event.target.value)
                                                ];
                                            if (address)
                                                applyAddress(
                                                    address,
                                                    lookupStatus === 'success'
                                                        ? data
                                                        : lookupStart.current,
                                                );
                                        }}
                                    >
                                        <option value="" disabled>
                                            {t(
                                                'registration.postal.choose_label',
                                            )}
                                        </option>
                                        {addressChoices.map(
                                            (address, index) => (
                                                <option
                                                    key={index}
                                                    value={index}
                                                >
                                                    {address.prefecture}
                                                    {address.city}
                                                    {address.town}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="prefecture">
                                {t('Prefecture')}
                            </Label>
                            <Input
                                id="prefecture"
                                name="prefecture"
                                value={data.prefecture}
                                onChange={(e) =>
                                    setData('prefecture', e.target.value)
                                }
                                required
                                autoComplete="address-level1"
                            />
                            <InputError message={errors.prefecture} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="city">{t('City')}</Label>
                        <Input
                            id="city"
                            name="city"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            required
                            autoComplete="address-level2"
                        />
                        <InputError message={errors.city} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address_line1">
                            {t('Address Line 1')}
                        </Label>
                        <Input
                            id="address_line1"
                            name="address_line1"
                            value={data.address_line1}
                            onChange={(e) =>
                                setData('address_line1', e.target.value)
                            }
                            required
                            autoComplete="address-line1"
                        />
                        <InputError message={errors.address_line1} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address_line2">
                            {t('Address Line 2')}
                        </Label>
                        <Input
                            id="address_line2"
                            name="address_line2"
                            value={data.address_line2}
                            onChange={(e) =>
                                setData('address_line2', e.target.value)
                            }
                            autoComplete="address-line2"
                        />
                        <InputError message={errors.address_line2} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">{t('Phone')}</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            required
                            type="tel"
                            autoComplete="tel"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full cursor-pointer"
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
                    <svg
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="google"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                    >
                        <path
                            fill="currentColor"
                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                        ></path>
                    </svg>
                    {t('auth.login_with_google')}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                    {t('Already have an account?')}{' '}
                    <TextLink href={loginRoute()}>{t('Log in')}</TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
