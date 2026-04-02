export type TransactionStatus =
    | 'pending_payment'
    | 'paid'
    | 'shipped'
    | 'delivered'
    | 'received'
    | 'cancelled';

export const TRANSACTION_STATUS = {
    PENDING_PAYMENT: 'pending_payment' as TransactionStatus,
    PAID: 'paid' as TransactionStatus,
    SHIPPED: 'shipped' as TransactionStatus,
    DELIVERED: 'delivered' as TransactionStatus,
    RECEIVED: 'received' as TransactionStatus,
    CANCELLED: 'cancelled' as TransactionStatus,
};
