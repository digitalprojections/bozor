import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface BalanceTilesProps {
    balance: number;
    points: number;
}

export function BalanceTiles({ balance, points }: BalanceTilesProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
        }).format(amount);
    };

    return (
        <Card className="overflow-hidden rounded-[24px] border-[#f0f2f5] bg-[#fafcff] shadow-sm">
            <CardContent className="p-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex flex-1 items-center justify-between rounded-[20px] bg-[#f8fafd] p-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[0.95rem] font-medium text-[#5f6c84]">PayPay balance</span>
                            <span className="text-2xl font-bold text-[#0b1a31]">{formatCurrency(balance)}</span>
                        </div>
                        <Badge variant="secondary" className="rounded-full bg-[#e6ecf5] px-3 py-1 text-[0.7rem] font-medium text-[#2a3f5e] hover:bg-[#dce6f2]">
                            auto-charge
                        </Badge>
                    </div>

                    <div className="flex flex-1 items-center justify-between rounded-[20px] bg-[#f8fafd] p-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[0.95rem] font-medium text-[#5f6c84]">PayPay points</span>
                            <span className="text-2xl font-bold text-[#0b1a31]">{points.toLocaleString()} pt</span>
                        </div>
                        <Badge variant="secondary" className="rounded-full bg-[#e6ecf5] px-3 py-1 text-[0.7rem] font-medium text-[#2a3f5e] hover:bg-[#dce6f2]">
                            as of 1:03
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
