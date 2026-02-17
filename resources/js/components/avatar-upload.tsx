import { useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useInitials } from '@/hooks/use-initials';
import { Upload, X } from 'lucide-react';
import type { User } from '@/types';

type AvatarUploadProps = {
    onFileChange: (file: File | null) => void;
    onStyleChange: (style: string) => void;
    onGenderChange: (gender: string) => void;
    onRemoveAvatar: (remove: boolean) => void;
    currentFile: File | null;
    removeAvatar: boolean;
};

const AVATAR_STYLES = [
    { value: 'initials', label: 'Initials' },
    { value: 'avataaars', label: 'Avataaars' },
    { value: 'personas', label: 'Personas' },
    { value: 'lorelei', label: 'Lorelei' },
    { value: 'micah', label: 'Micah' },
    { value: 'bottts', label: 'Bottts (Robot)' },
    { value: 'pixel-art', label: 'Pixel Art' },
    { value: 'adventurer', label: 'Adventurer' },
    { value: 'big-smile', label: 'Big Smile' },
];

const GENDER_OPTIONS = [
    { value: 'unspecified', label: 'Not specified' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

export function AvatarUpload({
    onFileChange,
    onStyleChange,
    onGenderChange,
    onRemoveAvatar,
    currentFile,
    removeAvatar,
}: AvatarUploadProps) {
    const { auth } = usePage().props;
    const user = auth.user as User;
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.target.files?.[0];
        if (file) {
            onFileChange(file);
            onRemoveAvatar(false);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveClick = () => {
        onRemoveAvatar(true);
        onFileChange(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const displayAvatarUrl = removeAvatar
        ? null
        : previewUrl || user.avatar_url;

    const hasCustomAvatar = user.avatar && !removeAvatar;

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24 overflow-hidden rounded-full">
                    <AvatarImage src={displayAvatarUrl || undefined} alt={user.name} />
                    <AvatarFallback className="rounded-lg bg-neutral-200 text-2xl text-black dark:bg-neutral-700 dark:text-white">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Avatar
                        </Button>

                        {(hasCustomAvatar || currentFile) && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRemoveClick}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Remove
                            </Button>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <p className="text-sm text-muted-foreground">
                        JPG, PNG up to 2MB. Or choose a generated avatar style below.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="avatar_style">Avatar Style</Label>
                    <Select
                        name="avatar_style"
                        defaultValue={user.avatar_style || 'initials'}
                        onValueChange={onStyleChange}
                    >
                        <SelectTrigger id="avatar_style">
                            <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                            {AVATAR_STYLES.map((style) => (
                                <SelectItem key={style.value} value={style.value}>
                                    {style.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="gender">Gender (for avatar)</Label>
                    <Select
                        name="gender"
                        defaultValue={user.gender || 'unspecified'}
                        onValueChange={onGenderChange}
                    >
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            {GENDER_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        Some avatar styles use gender for appearance
                    </p>
                </div>
            </div>
        </div>
    );
}
