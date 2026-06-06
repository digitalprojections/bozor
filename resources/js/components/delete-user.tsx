import { Form } from '@inertiajs/react';
import { useRef, useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const confirmationInput = useRef<HTMLInputElement>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const { t } = useTranslations();
    const requiredConfirmationText = 'DELETE';
    const isDeleteConfirmationMissing =
        !confirmationText || confirmationText !== requiredConfirmationText;

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title={t('profile.delete_account.title')}
                description={t('profile.delete_account.description')}
            />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">{t('profile.delete_account.warning')}</p>
                    <p className="text-sm">
                        {t('profile.delete_account.caution')}
                    </p>
                </div>

                <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={(open) => {
                        setIsDeleteDialogOpen(open);

                        if (!open) {
                            setConfirmationText('');
                        }
                    }}
                >
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            {t('profile.delete_account.button')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            {t('profile.delete_account.confirm_title')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('profile.delete_account.confirm_description')}
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={(errors) => {
                                if (errors.confirmation_text) {
                                    confirmationInput.current?.focus();

                                    return;
                                }

                                passwordInput.current?.focus();
                            }}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-200/10 dark:bg-red-700/10 dark:text-red-100">
                                        {t('profile.delete_account.final_warning')}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                        >
                                            {t('auth.password')}
                                        </Label>

                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder={t('auth.password')}
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="confirmation_text">
                                            {t('profile.delete_account.confirmation_label')}
                                        </Label>

                                        <Input
                                            id="confirmation_text"
                                            type="text"
                                            name="confirmation_text"
                                            ref={confirmationInput}
                                            value={confirmationText}
                                            onChange={(event) =>
                                                setConfirmationText(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder={requiredConfirmationText}
                                            autoComplete="off"
                                            aria-describedby="delete-confirmation-help"
                                        />

                                        <p
                                            id="delete-confirmation-help"
                                            className="text-muted-foreground text-sm"
                                        >
                                            {t(
                                                'profile.delete_account.confirmation_help',
                                            )}
                                        </p>

                                        <InputError
                                            message={errors.confirmation_text}
                                        />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setConfirmationText('');
                                                    resetAndClearErrors();
                                                }}
                                            >
                                                {t('common.cancel')}
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={
                                                processing ||
                                                isDeleteConfirmationMissing
                                            }
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                disabled={
                                                    processing ||
                                                    isDeleteConfirmationMissing
                                                }
                                                data-test="confirm-delete-user-button"
                                            >
                                                {t('profile.delete_account.button')}
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
