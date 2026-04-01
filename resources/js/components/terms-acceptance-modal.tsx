import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import { ShieldCheck } from 'lucide-react';

interface TermsAcceptanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccepted: () => void;
}

export function TermsAcceptanceModal({ isOpen, onClose, onAccepted }: TermsAcceptanceModalProps) {
    const { t } = useTranslations();
    const [accepted, setAccepted] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleAccept = () => {
        if (!accepted) return;

        setProcessing(true);
        router.post('/user/accept-terms', {}, {
            onSuccess: () => {
                setProcessing(false);
                onAccepted();
                onClose();
            },
            onError: () => {
                setProcessing(false);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md rounded-[24px]">
                <DialogHeader className="space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-[#f3f9ff] flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-[#0d9488]" />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold text-[#0b1b32]">
                        {t('terms.modal_title')}
                    </DialogTitle>
                    <DialogDescription className="text-center text-[#5f6c84] leading-relaxed">
                        {t('terms.modal_description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-start space-x-3 bg-[#f8fafd] p-4 rounded-xl border border-[#edf2f9]">
                        <Checkbox 
                            id="modal-terms" 
                            checked={accepted} 
                            onCheckedChange={(checked) => setAccepted(!!checked)}
                            className="mt-1 border-[#cfddee]"
                        />
                        <Label htmlFor="modal-terms" className="text-sm font-normal leading-relaxed text-[#1a263b] cursor-pointer">
                            {t('terms.accept_checkbox')}{' '}
                            <Link href="/terms" className="text-[#0d9488] font-bold hover:underline" target="_blank" onClick={(e) => e.stopPropagation()}>
                                {t('layout.footer.terms')}
                            </Link>
                            {' & '}
                            <Link href="/privacy" className="text-[#0d9488] font-bold hover:underline" target="_blank" onClick={(e) => e.stopPropagation()}>
                                {t('layout.footer.privacy')}
                            </Link>
                        </Label>
                    </div>

                    <p className="text-[11px] text-[#7f8fa4] italic text-center px-4">
                        {t('terms.platform_free_notice')}
                    </p>
                </div>

                <DialogFooter>
                    <Button 
                        onClick={handleAccept} 
                        disabled={!accepted || processing}
                        className="w-full h-12 rounded-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-lg shadow-md"
                    >
                        {processing ? '...' : t('terms.accept_button')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
