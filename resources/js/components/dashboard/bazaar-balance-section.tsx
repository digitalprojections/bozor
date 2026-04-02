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
                        </div>
                    </div>

                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="text-[0.9rem] font-medium text-[#5f6c84]">{t('layout.balance.points')}</span>
                            <span className="text-3xl font-bold text-[#0b1a31]">{Math.floor(points).toLocaleString()} pt</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Quick Links - Removed as they are placeholders */}
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
