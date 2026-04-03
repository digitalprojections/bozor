import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/hooks/use-translations';
import { TRANSACTION_STATUS, type TransactionStatus } from '@/types/transaction-status';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: TransactionStatus | string;
    className?: string;
}

export function TransactionStatusBadge({ status, className }: StatusBadgeProps) {
    const { t } = useTranslations();

    const getStatusStyles = (status: string) => {
        switch (status) {
            case TRANSACTION_STATUS.PENDING_PAYMENT:
                return "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50";
            case TRANSACTION_STATUS.PAID:
                return "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50";
            case TRANSACTION_STATUS.SHIPPED:
                return "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-50";
            case TRANSACTION_STATUS.DELIVERED:
                return "bg-green-50 text-green-700 border-green-100 hover:bg-green-50";
            case TRANSACTION_STATUS.RECEIVED:
                return "bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-50";
            case TRANSACTION_STATUS.CANCELLED:
                return "bg-red-50 text-red-700 border-red-100 hover:bg-red-50";
            default:
                return "";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case TRANSACTION_STATUS.PENDING_PAYMENT:
                return t('transaction.status.pending_payment') || 'Pending Payment';
            case TRANSACTION_STATUS.PAID:
                return t('transaction.status.paid');
            case TRANSACTION_STATUS.SHIPPED:
                return t('transaction.status.shipped');
            case TRANSACTION_STATUS.DELIVERED:
                return t('transaction.status.delivered');
            case TRANSACTION_STATUS.RECEIVED:
                return t('transaction.status.completed');
            case TRANSACTION_STATUS.CANCELLED:
                return t('transaction.cancel') || 'Cancelled';
            default:
                return status;
        }
    };

    const styles = getStatusStyles(status);
    
    if (!styles) {
        return <Badge variant="outline" className={className}>{status}</Badge>;
    }

    return (
        <Badge className={cn(styles, "font-medium", className)}>
            {getStatusLabel(status)}
        </Badge>
    );
}
