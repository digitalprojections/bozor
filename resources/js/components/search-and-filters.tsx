import { Search, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    viewMode: 'grid' | 'list';
    onSearch: (search: string) => void;
    onCategoryChange: (categoryId: number | null) => void;
    onSortChange: (sort: string) => void;
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function SearchAndFilters({
    categories,
    currentCategory,
    currentSort,
    currentSearch,
    viewMode,
    onSearch,
    onCategoryChange,
    onSortChange,
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
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={t('marketplace.search.placeholder')}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button type="submit">{t('marketplace.search.button')}</Button>
            </form>

            {/* Filters and View Controls */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                    <Select
                        value={currentCategory?.toString() || 'all'}
                        onValueChange={(value) =>
                            onCategoryChange(
                                value === 'all' ? null : parseInt(value)
                            )
                        }
                    >
                        <SelectTrigger className="w-[180px]">
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
                    <SelectTrigger className="w-[150px]">
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

                {/* View Mode Toggle */}
                <div className="ml-auto flex gap-1 rounded-md border p-1">
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => onViewModeChange('grid')}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => onViewModeChange('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Active Filters */}
            {(currentSearch || currentCategory) && (
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
                </div>
            )}
        </div>
    );
}
