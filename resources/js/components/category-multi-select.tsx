import { useMemo, useState } from 'react';
import {
    Check,
    ChevronDown,
    ChevronRight,
    Search,
    Sparkles,
    X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Category {
    id: number;
    name: string;
    children?: Category[];
}

interface CategoryMultiSelectProps {
    categories: Category[];
    value: number[];
    onChange: (value: number[]) => void;
    maxSelections?: number;
    error?: string;
}

interface CategoryOption {
    id: number;
    name: string;
    path: string;
    parentId?: number;
    parentName?: string;
    children: Category[];
    isParent: boolean;
}

export function CategoryMultiSelect({
    categories,
    value,
    onChange,
    maxSelections = 5,
    error,
}: CategoryMultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeParentId, setActiveParentId] = useState<number | null>(
        categories[0]?.id ?? null,
    );

    const categoryOptions = useMemo(
        () => flattenCategories(categories),
        [categories],
    );

    const selectedCategories = categoryOptions.filter((category) =>
        value.includes(category.id),
    );

    const activeParent =
        categories.find((category) => category.id === activeParentId) ??
        categories[0];

    const activeParentOption = categoryOptions.find(
        (category) => category.id === activeParent?.id,
    );

    const activeChildren = activeParent?.children ?? [];
    const normalizedQuery = query.trim().toLowerCase();

    const searchResults = normalizedQuery
        ? categoryOptions
              .filter((category) =>
                  category.path.toLowerCase().includes(normalizedQuery),
              )
              .slice(0, 12)
        : [];

    const suggestedCategories = categoryOptions
        .filter((category) =>
            [
                'Mobile Phones',
                'Women Clothing',
                'Men Clothing',
                'Video Games',
                'Toys & Games',
                'Home Decor',
                'Kitchen & Dining',
                'Skincare',
            ].includes(category.name),
        )
        .slice(0, 8);

    const canAddMore = value.length < maxSelections;

    const toggleCategory = (categoryId: number) => {
        if (value.includes(categoryId)) {
            onChange(value.filter((id) => id !== categoryId));
            return;
        }

        if (canAddMore) {
            onChange([...value, categoryId]);
        }
    };

    const removeCategory = (categoryId: number) => {
        onChange(value.filter((id) => id !== categoryId));
    };

    const clearCategories = () => {
        onChange([]);
    };

    return (
        <div className="space-y-2">
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm shadow-xs transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                        error && 'border-red-500',
                    )}
                >
                    <span
                        className={cn(
                            'line-clamp-1',
                            selectedCategories.length === 0 &&
                                'text-muted-foreground',
                        )}
                    >
                        {selectedCategories.length > 0
                            ? selectedCategories
                                  .map((category) => category.path)
                                  .join(', ')
                            : 'Select categories...'}
                    </span>
                    <ChevronDown
                        className={cn(
                            'ml-3 h-4 w-4 shrink-0 opacity-50 transition-transform',
                            isOpen && 'rotate-180',
                        )}
                    />
                </button>

                {isOpen && (
                    <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border bg-popover shadow-lg">
                        <div className="border-b p-3">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Search categories"
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {normalizedQuery ? (
                            <div className="max-h-80 overflow-y-auto p-2">
                                {searchResults.length > 0 ? (
                                    searchResults.map((category) => (
                                        <CategoryRow
                                            key={category.id}
                                            category={category}
                                            selected={value.includes(
                                                category.id,
                                            )}
                                            disabled={
                                                !value.includes(category.id) &&
                                                !canAddMore
                                            }
                                            onClick={() =>
                                                toggleCategory(category.id)
                                            }
                                        />
                                    ))
                                ) : (
                                    <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                                        No matching categories
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {suggestedCategories.length > 0 && (
                                    <div className="border-b p-3">
                                        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            Common picks
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestedCategories.map(
                                                (category) => (
                                                    <button
                                                        key={category.id}
                                                        type="button"
                                                        onClick={() =>
                                                            toggleCategory(
                                                                category.id,
                                                            )
                                                        }
                                                        disabled={
                                                            !value.includes(
                                                                category.id,
                                                            ) && !canAddMore
                                                        }
                                                        className={cn(
                                                            'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                                                            'hover:bg-accent hover:text-accent-foreground',
                                                            value.includes(
                                                                category.id,
                                                            ) &&
                                                                'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
                                                            !value.includes(
                                                                category.id,
                                                            ) &&
                                                                !canAddMore &&
                                                                'cursor-not-allowed opacity-50',
                                                        )}
                                                    >
                                                        {category.name}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid max-h-96 grid-cols-1 overflow-hidden sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
                                    <div className="max-h-96 overflow-y-auto border-b sm:border-r sm:border-b-0">
                                        {categories.map((category) => {
                                            const isActive =
                                                category.id ===
                                                activeParent?.id;
                                            const isSelected = value.includes(
                                                category.id,
                                            );

                                            return (
                                                <button
                                                    key={category.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveParentId(
                                                            category.id,
                                                        )
                                                    }
                                                    className={cn(
                                                        'flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition-colors',
                                                        'hover:bg-accent hover:text-accent-foreground',
                                                        isActive && 'bg-accent',
                                                    )}
                                                >
                                                    <span className="min-w-0 truncate">
                                                        {category.name}
                                                    </span>
                                                    <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
                                                        {isSelected && (
                                                            <Check className="h-3.5 w-3.5 text-primary" />
                                                        )}
                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="max-h-96 overflow-y-auto p-2">
                                        {activeParentOption && (
                                            <CategoryRow
                                                category={activeParentOption}
                                                selected={value.includes(
                                                    activeParentOption.id,
                                                )}
                                                disabled={
                                                    !value.includes(
                                                        activeParentOption.id,
                                                    ) && !canAddMore
                                                }
                                                onClick={() =>
                                                    toggleCategory(
                                                        activeParentOption.id,
                                                    )
                                                }
                                            />
                                        )}

                                        {activeChildren.map((category) => {
                                            const option = categoryOptions.find(
                                                (item) =>
                                                    item.id === category.id,
                                            );

                                            if (!option) {
                                                return null;
                                            }

                                            return (
                                                <CategoryRow
                                                    key={option.id}
                                                    category={option}
                                                    selected={value.includes(
                                                        option.id,
                                                    )}
                                                    disabled={
                                                        !value.includes(
                                                            option.id,
                                                        ) && !canAddMore
                                                    }
                                                    onClick={() =>
                                                        toggleCategory(
                                                            option.id,
                                                        )
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex items-center justify-between border-t px-3 py-2">
                            <span className="text-xs text-muted-foreground">
                                {value.length}/{maxSelections} selected
                            </span>
                            <div className="flex gap-2">
                                {value.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearCategories}
                                    >
                                        Clear
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Done
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                        <Badge
                            key={category.id}
                            variant="secondary"
                            className="max-w-full gap-1 pr-1"
                        >
                            <span className="truncate">{category.path}</span>
                            <button
                                type="button"
                                onClick={() => removeCategory(category.id)}
                                className="ml-1 rounded-full p-0.5 hover:bg-muted"
                                aria-label={`Remove ${category.name}`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {value.length >= maxSelections && (
                <p className="text-xs text-muted-foreground">
                    Maximum {maxSelections} categories selected
                </p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

function CategoryRow({
    category,
    selected,
    disabled,
    onClick,
}: {
    category: CategoryOption;
    selected: boolean;
    disabled: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                selected && 'bg-accent text-accent-foreground',
                disabled && 'cursor-not-allowed opacity-50',
            )}
        >
            <span className="min-w-0">
                <span className="block truncate font-medium">
                    {category.name}
                </span>
                {category.parentName && (
                    <span className="block truncate text-xs text-muted-foreground">
                        {category.parentName}
                    </span>
                )}
            </span>
            {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
        </button>
    );
}

function flattenCategories(categories: Category[]): CategoryOption[] {
    return categories.flatMap((category) => {
        const parentOption: CategoryOption = {
            id: category.id,
            name: category.name,
            path: category.name,
            children: category.children ?? [],
            isParent: true,
        };

        const childOptions = (category.children ?? []).map((child) => ({
            id: child.id,
            name: child.name,
            path: `${category.name} > ${child.name}`,
            parentId: category.id,
            parentName: category.name,
            children: child.children ?? [],
            isParent: false,
        }));

        return [parentOption, ...childOptions];
    });
}
