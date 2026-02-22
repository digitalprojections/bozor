import { useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
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
    const { t } = useTranslations();
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const AVATAR_STYLES = [
        { value: 'initials', label: t('profile.avatar.styles.initials') },
        { value: 'avataaars', label: t('profile.avatar.styles.avataaars') },
        { value: 'personas', label: t('profile.avatar.styles.personas') },
        { value: 'lorelei', label: t('profile.avatar.styles.lorelei') },
        { value: 'micah', label: t('profile.avatar.styles.micah') },
        { value: 'bottts', label: t('profile.avatar.styles.bottts') },
        { value: 'pixel-art', label: t('profile.avatar.styles.pixel_art') },
        { value: 'adventurer', label: t('profile.avatar.styles.adventurer') },
        { value: 'big-smile', label: t('profile.avatar.styles.big_smile') },
    ];

    const GENDER_OPTIONS = [
        { value: 'unspecified', label: t('profile.avatar.gender.not_specified') },
        { value: 'male', label: t('profile.avatar.gender.male') },
        { value: 'female', label: t('profile.avatar.gender.female') },
        { value: 'other', label: t('profile.avatar.gender.other') },
    ];

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
                            {t('profile.avatar.upload')}
                        </Button>

                        {(hasCustomAvatar || currentFile) && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRemoveClick}
                            >
                                <X className="mr-2 h-4 w-4" />
                                {t('profile.avatar.remove')}
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
                        {t('profile.avatar.file_help')}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="avatar_style">{t('profile.avatar.style')}</Label>
                    <Select
                        name="avatar_style"
                        defaultValue={user.avatar_style || 'initials'}
                        onValueChange={onStyleChange}
                    >
                        <SelectTrigger id="avatar_style">
                            <SelectValue placeholder={t('common.select_style')} />
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
                    <Label htmlFor="gender">{t('profile.avatar.gender')}</Label>
                    <Select
                        name="gender"
                        defaultValue={user.gender || 'unspecified'}
                        onValueChange={onGenderChange}
                    >
                        <SelectTrigger id="gender">
                            <SelectValue placeholder={t('common.select_gender')} />
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
                        {t('profile.avatar.gender_help')}
                    </p>
                </div>
            </div>
        </div>
    );
}
