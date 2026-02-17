import { Search, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
                        placeholder="Search listings..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button type="submit">Search</Button>
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
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
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
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="price_low">
                            Price: Low to High
                        </SelectItem>
                        <SelectItem value="price_high">
                            Price: High to Low
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
                            Search: {currentSearch}
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
                            Category:{' '}
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
