import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { Badge } from '@/components/ui/badge';

interface BazaarBalanceSectionProps {
    balance: number;
    points: number;
}

export function BazaarBalanceSection({ balance, points }: BazaarBalanceSectionProps) {
    const { t } = useTranslations();

    const formatCurrency = (amt: number) => {
        return Math.floor(amt).toLocaleString() + ' 円';
    };

    return (
        <Card className="overflow-hidden rounded-[4px] border-[#f0f2f5] bg-white shadow-sm">
            <CardContent className="p-0 flex flex-col md:flex-row">
                {/* Left Side: Balance and Points */}
                <div className="flex-1 border-r border-[#f0f2f5] p-6 flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <img src="/images/pay-logo.png" alt="Wallet" className="h-5 grayscale opacity-70" />
                                <span className="text-[0.9rem] font-medium text-[#5f6c84]">{t('layout.balance.wallet')}</span>
                            </div>
                            <span className="text-3xl font-bold text-[#0b1a31]">{formatCurrency(balance)}</span>
                            <div className="mt-1">
                                <Badge variant="secondary" className="bg-[#f0f4fe] text-[0.7rem] text-[#1a4cbc] hover:bg-[#e0e8fd] font-normal px-2 py-0">
                                    {t('layout.balance.auto_topup')}
                                </Badge>
                            </div>
                        </div>
                        <button className="text-[0.75rem] font-medium text-[#0066cc] hover:underline">
                            Details
                        </button>
                    </div>

                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="text-[0.9rem] font-medium text-[#5f6c84]">{t('layout.balance.points')}</span>
                            <span className="text-3xl font-bold text-[#0b1a31]">{Math.floor(points).toLocaleString()} pt</span>
                        </div>
                        <button className="text-[0.75rem] font-medium text-[#0066cc] hover:underline">
                            Details
                        </button>
                    </div>
                </div>

                {/* Right Side: Quick Links */}
                <div className="w-full md:w-[320px] bg-[#fafcff]">
                    <div className="flex flex-col h-full">
                        <QuickLink label={t('layout.balance.membership')} />
                        <QuickLink label={t('layout.balance.coupons')} />
                        <QuickLink label={t('layout.balance.campaigns')} />
                        <QuickLink label={t('layout.balance.security')} isLast />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function QuickLink({ label, isLast = false }: { label: string, isLast?: boolean }) {
    return (
        <a
            href="#"
            className={`flex items-center justify-between px-6 py-[1.1rem] text-[0.95rem] text-[#1a263b] hover:bg-white transition-colors ${!isLast ? 'border-b border-[#f0f2f5]' : ''}`}
        >
            <span className="font-medium">{label}</span>
            <ChevronRight size={16} className="text-[#a3b6cc]" />
        </a>
    );
}
