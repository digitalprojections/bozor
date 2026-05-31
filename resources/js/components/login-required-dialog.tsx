import { Link } from '@inertiajs/react';
import { LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useTranslations } from '@/hooks/use-translations';

interface LoginRequiredDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
}

export function LoginRequiredDialog({
    open,
    onOpenChange,
    title,
    description,
}: LoginRequiredDialogProps) {
    const { t } = useTranslations();
    const defaultTitle = t('auth.login_required_title') === 'auth.login_required_title'
        ? 'Login required'
        : t('auth.login_required_title');
    const defaultDescription = t('auth.login_required_description') === 'auth.login_required_description'
        ? 'Please log in to continue. You can keep browsing, and we will only take you to login when you choose to.'
        : t('auth.login_required_description');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-[18px] border-[#dbe7f5] p-0 overflow-hidden">
                <div className="bg-[#f3f9ff] px-6 pt-6 pb-4">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#2b4b8f] shadow-sm">
                        <LockKeyhole size={24} />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-xl text-[#0b1b32]">
                            {title ?? defaultTitle}
                        </DialogTitle>
                        <DialogDescription className="text-[#5f6c84] leading-relaxed">
                            {description ?? defaultDescription}
                        </DialogDescription>
                    </DialogHeader>
                </div>
                <DialogFooter className="px-6 pb-6 sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-[#cbd5e1]"
                        onClick={() => onOpenChange(false)}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button asChild className="rounded-full bg-[#0d9488] px-6 text-white hover:bg-[#0f766e]">
                        <Link href="/login">{t('common.login')}</Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
