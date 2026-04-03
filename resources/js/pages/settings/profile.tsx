import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { AvatarUpload } from '@/components/avatar-upload';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BazaarLayout from '@/layouts/bazaar-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { useTranslations } from '@/hooks/use-translations';
import { BannerUpload } from '@/components/banner-upload';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props as any;
    const { t } = useTranslations();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarStyle, setAvatarStyle] = useState<string>(auth.user.avatar_style || '');
    const [avatarSeed, setAvatarSeed] = useState<string>(auth.user.avatar_seed || '');
    const [gender, setGender] = useState<string>('');
    const [removeAvatar, setRemoveAvatar] = useState(false);
    
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [removeBanner, setRemoveBanner] = useState(false);

    // Reset avatar state when status changes (indicating successful save)
    useEffect(() => {
        if (status && (avatarFile !== null || removeAvatar !== false || bannerFile !== null || removeBanner !== false)) {
            const timer = setTimeout(() => {
                setAvatarFile(null);
                setRemoveAvatar(false);
                setBannerFile(null);
                setRemoveBanner(false);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [status, avatarFile, removeAvatar, bannerFile, removeBanner]);

    return (
        <BazaarLayout title="Profile Settings" breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile Settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your avatar, name and email address"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="rounded-lg border border-sidebar-border/80 p-6">
                                    <AvatarUpload
                                        onFileChange={setAvatarFile}
                                        onStyleChange={setAvatarStyle}
                                        onSeedChange={setAvatarSeed}
                                        onGenderChange={setGender}
                                        onRemoveAvatar={setRemoveAvatar}
                                        currentFile={avatarFile}
                                        removeAvatar={removeAvatar}
                                    />
                                    {errors.avatar && (
                                        <InputError
                                            className="mt-2"
                                            message={errors.avatar}
                                        />
                                    )}
                                </div>

                                {/* File input for avatar - only included when file is selected */}
                                {avatarFile && (
                                    <input
                                        type="file"
                                        name="avatar"
                                        className="hidden"
                                        ref={(input) => {
                                            if (input) {
                                                const dataTransfer = new DataTransfer();
                                                dataTransfer.items.add(avatarFile);
                                                input.files = dataTransfer.files;
                                            }
                                        }}
                                    />
                                )}

                                {/* Hidden inputs for avatar data */}
                                {avatarStyle && (
                                    <input
                                        type="hidden"
                                        name="avatar_style"
                                        value={avatarStyle}
                                    />
                                )}
                                {avatarSeed && (
                                    <input
                                        type="hidden"
                                        name="avatar_seed"
                                        value={avatarSeed}
                                    />
                                )}
                                {gender && gender !== 'unspecified' && (
                                    <input
                                        type="hidden"
                                        name="gender"
                                        value={gender}
                                    />
                                )}
                                {removeAvatar && (
                                    <input
                                        type="hidden"
                                        name="remove_avatar"
                                        value="1"
                                    />
                                )}

                                {bannerFile && (
                                    <input
                                        type="file"
                                        name="store_banner"
                                        className="hidden"
                                        ref={(input) => {
                                            if (input) {
                                                const dataTransfer = new DataTransfer();
                                                dataTransfer.items.add(bannerFile);
                                                input.files = dataTransfer.files;
                                            }
                                        }}
                                    />
                                )}

                                {removeBanner && (
                                    <input
                                        type="hidden"
                                        name="remove_store_banner"
                                        value="1"
                                    />
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send().url}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                    <div className="mt-2 text-sm font-medium text-green-600">
                                                        A new verification link has
                                                        been sent to your email
                                                        address.
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>

                                <Separator className="my-8" />

                                <div className="space-y-6">
                                    <Heading
                                        variant="small"
                                        title={t('Store Information')}
                                        description={t('Store Settings Description')}
                                    />

                                    <div className="grid gap-2">
                                        <Label htmlFor="store_name">{t('Store Name')}</Label>
                                        <Input
                                            id="store_name"
                                            name="store_name"
                                            defaultValue={auth.user.store_name}
                                            placeholder={t('Store Name Placeholder')}
                                        />
                                        <InputError message={errors.store_name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="store_description">{t('Store Description')}</Label>
                                        <Textarea
                                            id="store_description"
                                            name="store_description"
                                            rows={4}
                                            defaultValue={auth.user.store_description}
                                            placeholder={t('Store Description Placeholder')}
                                        />
                                        <InputError message={errors.store_description} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>{t('Store Banner')}</Label>
                                        <BannerUpload
                                            onFileChange={setBannerFile}
                                            onRemoveBanner={setRemoveBanner}
                                            currentFile={bannerFile}
                                            removeBanner={removeBanner}
                                            initialUrl={auth.user.store_banner_url}
                                        />
                                        <InputError message={errors.store_banner} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            disabled={processing}
                                        >
                                            {t('common.save') || 'Save'}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </BazaarLayout>
    );
}
