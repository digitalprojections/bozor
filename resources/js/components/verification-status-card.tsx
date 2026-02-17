import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { router } from '@inertiajs/react';

interface VerificationRequest {
    id: number;
    status: 'pending' | 'approved' | 'rejected';
    reason?: string;
    admin_notes?: string;
    created_at: string;
    reviewed_at?: string;
}

interface VerificationStatusCardProps {
    verificationRequest?: VerificationRequest;
    isVerified: boolean;
}

export function VerificationStatusCard({ verificationRequest, isVerified }: VerificationStatusCardProps) {
    const { t } = useTranslations();

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="size-5 text-green-600" />;
            case 'pending':
                return <Clock className="size-5 text-yellow-600" />;
            case 'rejected':
                return <XCircle className="size-5 text-red-600" />;
            default:
                return null;
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'approved':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'rejected':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const handleRequestVerification = () => {
        router.visit('/verification/request');
    };

    const handleCancelRequest = () => {
        if (verificationRequest && confirm('Are you sure you want to cancel your verification request?')) {
            router.delete(`/verification/request/${verificationRequest.id}`);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('verification.status.title')}</CardTitle>
                <CardDescription>
                    {isVerified
                        ? t('verification.status.verified_description')
                        : t('verification.status.not_verified_description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isVerified ? (
                    <div className="flex items-center gap-2">
                        <CheckCircle className="size-5 text-green-600" />
                        <span className="font-medium text-green-600">
                            {t('verification.status.approved')}
                        </span>
                    </div>
                ) : verificationRequest ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(verificationRequest.status)}
                                <Badge variant={getStatusVariant(verificationRequest.status)}>
                                    {t(`verification.status.${verificationRequest.status}`)}
                                </Badge>
                            </div>
                            {verificationRequest.status === 'pending' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancelRequest}
                                >
                                    {t('verification.cancel_request')}
                                </Button>
                            )}
                        </div>

                        {verificationRequest.admin_notes && (
                            <div className="rounded-lg bg-muted p-3">
                                <p className="text-sm font-medium">{t('verification.admin.notes')}</p>
                                <p className="text-sm text-muted-foreground">
                                    {verificationRequest.admin_notes}
                                </p>
                            </div>
                        )}

                        {verificationRequest.status === 'rejected' && (
                            <Button onClick={handleRequestVerification} className="w-full">
                                {t('verification.request.resubmit')}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {t('verification.request.description')}
                        </p>
                        <Button onClick={handleRequestVerification} className="w-full">
                            {t('verification.request.submit')}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
