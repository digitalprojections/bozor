import { Search, Grid, List, SlidersHorizontal, Truck } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from '@/hooks/use-translations';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Category {
    id: number;
    name: string;
    listings_count: number;
}

interface SearchAndFiltersProps {
    categories: Category[];
    currentCategory?: number;
    currentSort: string;
    currentSearch: string;
    hideSold: boolean;
    freeShipping: boolean;
    viewMode: 'grid' | 'list';
    onSearch: (search: string) => void;
    onCategoryChange: (categoryId: number | null) => void;
    onSortChange: (sort: string) => void;
    onHideSoldChange: (hideSold: boolean) => void;
    onFreeShippingChange: (freeShipping: boolean) => void;
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function SearchAndFilters({
    categories,
    currentCategory,
    currentSort,
    currentSearch,
    hideSold,
    freeShipping,
    viewMode,
    onSearch,
    onCategoryChange,
    onSortChange,
    onHideSoldChange,
    onFreeShippingChange,
    onViewModeChange,
}: SearchAndFiltersProps) {
    const { t } = useTranslations();
    const [searchValue, setSearchValue] = useState(currentSearch);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchValue);
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={t('marketplace.search.placeholder')}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-10 h-10"
                    />
                </div>
                <Button type="submit" className="h-10 sm:w-auto w-full bg-[#1a263b] hover:bg-[#0b1a31] text-white">
                    <Search className="mr-2 h-4 w-4" />
                    {t('marketplace.search.button')}
                </Button>
            </form>

            {/* Filters and View Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    {/* Category Filter */}
                    <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                        <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
                        <Select
                            value={currentCategory?.toString() || 'all'}
                            onValueChange={(value) =>
                                onCategoryChange(
                                    value === 'all' ? null : parseInt(value)
                                )
                            }
                        >
                            <SelectTrigger className="w-full sm:w-[180px] h-10">
                                <SelectValue placeholder={t('marketplace.filters.all_categories')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('marketplace.filters.all_categories')}</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id.toString()}
                                    >
                                        {category.name} ({category.listings_count})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort */}
                    <Select value={currentSort} onValueChange={onSortChange}>
                        <SelectTrigger className="w-full sm:w-[150px] h-10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">{t('marketplace.filters.sort_newest')}</SelectItem>
                            <SelectItem value="oldest">{t('marketplace.filters.sort_oldest')}</SelectItem>
                            <SelectItem value="price_low">
                                {t('marketplace.filters.price_low_high')}
                            </SelectItem>
                            <SelectItem value="price_high">
                                {t('marketplace.filters.price_high_low')}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <label className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-md border bg-white px-3 text-sm text-[#333333] sm:w-auto">
                        <Checkbox
                            checked={hideSold}
                            onCheckedChange={(checked) =>
                                onHideSoldChange(checked === true)
                            }
                        />
                        <span>{t('marketplace.filters.hide_sold')}</span>
                    </label>

                    <label className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-sm font-medium text-emerald-800 sm:w-auto">
                        <Checkbox
                            checked={freeShipping}
                            onCheckedChange={(checked) =>
                                onFreeShippingChange(checked === true)
                            }
                        />
                        <Truck className="h-4 w-4 text-emerald-600" />
                        <span>{t('marketplace.filters.free_shipping')}</span>
                    </label>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center justify-end gap-1 rounded-md border p-1 bg-white sm:ml-auto">
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-10 p-0"
                        onClick={() => onViewModeChange('grid')}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-10 p-0"
                        onClick={() => onViewModeChange('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Active Filters */}
            {(currentSearch || currentCategory || hideSold || freeShipping) && (
                <div className="flex flex-wrap gap-2">
                    {currentSearch && (
                        <Badge variant="secondary">
                            {t('marketplace.filters.active_search')}: {currentSearch}
                            <button
                                onClick={() => {
                                    setSearchValue('');
                                    onSearch('');
                                }}
                                className="ml-2"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    {currentCategory && (
                        <Badge variant="secondary">
                            {t('marketplace.filters.active_category')}:{' '}
                            {
                                categories.find((c) => c.id === currentCategory)
                                    ?.name
                            }
                            <button
                                onClick={() => onCategoryChange(null)}
                                className="ml-2"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    {hideSold && (
                        <Badge variant="secondary">
                            {t('marketplace.filters.hide_sold')}
                            <button
                                onClick={() => onHideSoldChange(false)}
                                className="ml-2"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    {freeShipping && (
                        <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">
                            <Truck className="h-3 w-3" />
                            {t('marketplace.filters.free_shipping')}
                            <button
                                onClick={() => onFreeShippingChange(false)}
                                className="ml-2"
                            >
                                x
                            </button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
