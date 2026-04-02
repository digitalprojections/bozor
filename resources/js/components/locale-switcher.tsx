import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { ChevronDown } from 'lucide-react';

type LocaleSwitcherProps = {
    variant?: 'default' | 'ghost' | 'link' | 'outline' | 'secondary' | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
};

/**
 * Dropdown to switch the application locale. Uses shared translations and locale route.
 */
export function LocaleSwitcher({ variant = 'ghost', size = 'sm', className }: LocaleSwitcherProps) {
    const { locale, setLocale, supportedLocales } = useTranslations();
    const current = supportedLocales?.[locale];

    if (!supportedLocales || Object.keys(supportedLocales).length <= 1) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size={size} className={className}>
                    <span className="mr-1">{current?.native ?? locale}</span>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {Object.entries(supportedLocales).map(([code, { native: label }]) => (
                    <DropdownMenuItem
                        key={code}
                        onClick={() => setLocale(code)}
                        className={code === locale ? 'bg-accent' : ''}
                    >
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
