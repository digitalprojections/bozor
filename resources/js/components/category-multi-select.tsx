import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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

export function CategoryMultiSelect({
    categories,
    value,
    onChange,
    maxSelections = 5,
    error,
}: CategoryMultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const flattenCategories = (
        cats: Category[],
        parentName?: string
    ): Array<{ id: number; name: string; displayName: string; isChild: boolean }> => {
        let result: Array<{ id: number; name: string; displayName: string; isChild: boolean }> = [];

        cats.forEach((cat) => {
            const displayName = parentName ? `${parentName} → ${cat.name}` : cat.name;
            result.push({
                id: cat.id,
                name: cat.name,
                displayName,
                isChild: !!parentName,
            });

            if (cat.children && cat.children.length > 0) {
                result = result.concat(flattenCategories(cat.children, cat.name));
            }
        });

        return result;
    };

    const allCategories = flattenCategories(categories);
    const selectedCategories = allCategories.filter((cat) =>
        value.includes(cat.id)
    );

    const toggleCategory = (categoryId: number) => {
        if (value.includes(categoryId)) {
            onChange(value.filter((id) => id !== categoryId));
        } else if (value.length < maxSelections) {
            onChange([...value, categoryId]);
        }
    };

    const removeCategory = (categoryId: number) => {
        onChange(value.filter((id) => id !== categoryId));
    };

    return (
        <div className="space-y-2">
            {/* Dropdown Button */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                        error && 'border-red-500'
                    )}
                >
                    <span className="text-muted-foreground">
                        {value.length > 0
                            ? `${value.length} categor${value.length === 1 ? 'y' : 'ies'} selected`
                            : 'Select categories...'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
                        {allCategories.map((category) => {
                            const isSelected = value.includes(category.id);
                            const isDisabled =
                                !isSelected && value.length >= maxSelections;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => {
                                        if (!isDisabled) {
                                            toggleCategory(category.id);
                                        }
                                    }}
                                    disabled={isDisabled}
                                    className={cn(
                                        'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                                        'hover:bg-accent hover:text-accent-foreground',
                                        'focus:bg-accent focus:text-accent-foreground',
                                        isSelected && 'bg-accent',
                                        isDisabled &&
                                        'cursor-not-allowed opacity-50',
                                        category.isChild && 'pl-6'
                                    )}
                                >
                                    {isSelected && (
                                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                            ✓
                                        </span>
                                    )}
                                    <span className={isSelected ? 'ml-6' : ''}>
                                        {category.displayName}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Selected Categories Badges */}
            {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                        <Badge
                            key={category.id}
                            variant="secondary"
                            className="gap-1 pr-1"
                        >
                            {category.name}
                            <button
                                type="button"
                                onClick={() => removeCategory(category.id)}
                                className="ml-1 rounded-full p-0.5 hover:bg-muted"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Helper Text */}
            {value.length >= maxSelections && (
                <p className="text-xs text-muted-foreground">
                    Maximum {maxSelections} categories selected
                </p>
            )}

            {/* Error Message */}
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
