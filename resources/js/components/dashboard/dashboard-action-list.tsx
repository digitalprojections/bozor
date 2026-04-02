import { Card } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import React from 'react';

interface ActionItem {
    label: string;
    icon: React.ReactNode;
    href?: string;
}

interface DashboardActionListProps {
    title: string;
    items: ActionItem[];
    className?: string;
}

export function DashboardActionList({ title, items, className = '' }: DashboardActionListProps) {
    return (
        <Card className={`overflow-hidden rounded-[24px] border-[#f0f2f5] shadow-sm ${className}`}>
            <div className="px-6 py-5 pb-2 text-[1rem] font-semibold tracking-[0.3px] text-[#1d2b44]">
                {title}
            </div>
            <div className="flex flex-col">
                {items.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href || '#'}
                        className="flex items-center gap-4 border-b border-[#f0f4f9] px-6 py-[0.9rem] text-[#1a263b] transition-colors hover:bg-[#f9fcff] last:border-b-0"
                    >
                        <div className="flex shrink-0 items-center justify-center rounded-md text-[#3a5f8b]">
                            {item.icon}
                        </div>
                        <span className="flex-1 font-medium">{item.label}</span>
                        <ChevronRight size={18} className="text-[#a3b6cc]" />
                    </Link>
                ))}
            </div>
        </Card>
    );
}
