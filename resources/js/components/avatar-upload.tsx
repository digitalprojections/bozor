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
import { Upload, X, Palette, Layers, User as UserIcon, Shuffle } from 'lucide-react';
import type { User } from '@/types';
import { MascotAvatar } from '@/components/mascot-avatar';
import {
    AvatarConfig,
    CHARACTER_TYPES,
    EYE_TYPES,
    MOUTH_TYPES,
    ACCESSORY_TYPES,
    DEFAULT_COLORS,
    SKIN_TONES
} from '@/types/mascot-avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect } from 'react';

type AvatarUploadProps = {
    onFileChange: (file: File | null) => void;
    onStyleChange: (style: string) => void;
    onGenderChange: (gender: string) => void;
    onSeedChange?: (seed: string) => void;
    onRemoveAvatar: (remove: boolean) => void;
    currentFile: File | null;
    removeAvatar: boolean;
};

export function AvatarUpload({
    onFileChange,
    onStyleChange,
    onGenderChange,
    onSeedChange,
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
        { value: 'mascot', label: 'Mascot (Custom)' },
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

    const [selectedStyle, setSelectedStyle] = useState(user.avatar_style || 'initials');

    // Parse existing mascot config if it exists in seed
    const parseMascotConfig = useCallback((seed: string | null | undefined): AvatarConfig => {
        try {
            if (seed && seed.startsWith('{')) {
                return JSON.parse(seed);
            }
        } catch (e) {
            // silent fail
        }
        return {
            characterType: 'blob',
            bodyColor: DEFAULT_COLORS[0],
            eyeType: 'round',
            mouthType: 'smile',
            accessoryType: 'none',
            accessoryColor: DEFAULT_COLORS[1],
            skinTone: SKIN_TONES[0],
            size: 120,
        };
    }, []);

    const [mascotConfig, setMascotConfig] = useState<AvatarConfig>(parseMascotConfig(user.avatar_seed));

    useEffect(() => {
        if (selectedStyle === 'mascot') {
            onSeedChange?.(JSON.stringify(mascotConfig));
        }
    }, [mascotConfig, selectedStyle, onSeedChange]);

    const randomizeMascot = useCallback(() => {
        const randomConfig: AvatarConfig = {
            characterType: CHARACTER_TYPES[Math.floor(Math.random() * CHARACTER_TYPES.length)],
            bodyColor: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
            eyeType: EYE_TYPES[Math.floor(Math.random() * EYE_TYPES.length)],
            mouthType: MOUTH_TYPES[Math.floor(Math.random() * MOUTH_TYPES.length)],
            accessoryType: ACCESSORY_TYPES[Math.floor(Math.random() * ACCESSORY_TYPES.length)],
            accessoryColor: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
            skinTone: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
            size: 120,
        };
        setMascotConfig(randomConfig);
    }, []);

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
                <Avatar className="h-24 w-24 overflow-hidden rounded-full border border-sidebar-border bg-background">
                    {selectedStyle === 'mascot' ? (
                        <div className="flex h-full w-full items-center justify-center bg-background p-1">
                            <MascotAvatar {...mascotConfig} size={88} />
                        </div>
                    ) : (
                        <>
                            <AvatarImage src={displayAvatarUrl ?? undefined} alt={user.name} />
                            <AvatarFallback className="rounded-lg bg-neutral-200 text-2xl text-black dark:bg-neutral-700 dark:text-white">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </>
                    )}
                </Avatar>

                <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {t('profile.avatar.upload')}
                        </Button>

                        {selectedStyle === 'mascot' && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={randomizeMascot}
                            >
                                <Shuffle className="mr-2 h-4 w-4" />
                                {t('common.randomize') || 'Randomize'}
                            </Button>
                        )}

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
                        onValueChange={(val) => {
                            setSelectedStyle(val);
                            onStyleChange(val);
                        }}
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
            </div>

            <AnimatePresence>
                {selectedStyle === 'mascot' && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 space-y-6 rounded-xl border border-sidebar-border bg-sidebar-accent/30 p-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <UserIcon size={16} />
                                        <h3 className="text-xs font-semibold uppercase tracking-wider">Character Type</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {CHARACTER_TYPES.map(type => (
                                            <Button
                                                key={type}
                                                type="button"
                                                variant={mascotConfig.characterType === type ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setMascotConfig({ ...mascotConfig, characterType: type })}
                                                className="h-9 truncate"
                                            >
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </Button>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Palette size={16} />
                                        <h3 className="text-xs font-semibold uppercase tracking-wider">Colors</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] text-muted-foreground uppercase">Body Color</Label>
                                            <div className="flex flex-wrap gap-1.5">
                                                {DEFAULT_COLORS.map(color => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() => setMascotConfig({ ...mascotConfig, bodyColor: color })}
                                                        className={`h-6 w-6 rounded-full border transition-all ${mascotConfig.bodyColor === color ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[10px] text-muted-foreground uppercase">Skin Tone</Label>
                                            <div className="flex flex-wrap gap-1.5">
                                                {SKIN_TONES.map(tone => (
                                                    <button
                                                        key={tone}
                                                        type="button"
                                                        onClick={() => setMascotConfig({ ...mascotConfig, skinTone: tone })}
                                                        className={`h-6 w-6 rounded-full border transition-all ${mascotConfig.skinTone === tone ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                                                        style={{ backgroundColor: tone }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Layers size={16} />
                                        <h3 className="text-xs font-semibold uppercase tracking-wider">Features</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] text-muted-foreground uppercase">Eyes</Label>
                                            <div className="grid grid-cols-1 gap-1.5">
                                                {EYE_TYPES.map(type => (
                                                    <Button
                                                        key={type}
                                                        type="button"
                                                        variant={mascotConfig.eyeType === type ? 'secondary' : 'ghost'}
                                                        size="sm"
                                                        onClick={() => setMascotConfig({ ...mascotConfig, eyeType: type })}
                                                        className="h-7 justify-start px-2 py-0 text-[11px]"
                                                    >
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[10px] text-muted-foreground uppercase">Mouth</Label>
                                            <div className="grid grid-cols-1 gap-1.5">
                                                {MOUTH_TYPES.map(type => (
                                                    <Button
                                                        key={type}
                                                        type="button"
                                                        variant={mascotConfig.mouthType === type ? 'secondary' : 'ghost'}
                                                        size="sm"
                                                        onClick={() => setMascotConfig({ ...mascotConfig, mouthType: type })}
                                                        className="h-7 justify-start px-2 py-0 text-[11px]"
                                                    >
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <UserIcon size={16} />
                                        <h3 className="text-xs font-semibold uppercase tracking-wider">Accessories</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {ACCESSORY_TYPES.map(type => (
                                                <Button
                                                    key={type}
                                                    type="button"
                                                    variant={mascotConfig.accessoryType === type ? 'secondary' : 'ghost'}
                                                    size="sm"
                                                    onClick={() => setMascotConfig({ ...mascotConfig, accessoryType: type })}
                                                    className="h-7 text-[11px]"
                                                >
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </Button>
                                            ))}
                                        </div>

                                        {mascotConfig.accessoryType !== 'none' && (
                                            <div className="space-y-2">
                                                <Label className="text-[10px] text-muted-foreground uppercase">Accessory Color</Label>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {DEFAULT_COLORS.map(color => (
                                                        <button
                                                            key={color}
                                                            type="button"
                                                            onClick={() => setMascotConfig({ ...mascotConfig, accessoryColor: color })}
                                                            className={`h-5 w-5 rounded-full border transition-all ${mascotConfig.accessoryColor === color ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                                                            style={{ backgroundColor: color }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid gap-4 sm:grid-cols-2">
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
    );
}
