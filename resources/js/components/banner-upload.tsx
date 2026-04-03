import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ImageCompressor } from '@/lib/image-compressor';

type BannerUploadProps = {
    onFileChange: (file: File | null) => void;
    onRemoveBanner: (remove: boolean) => void;
    currentFile: File | null;
    removeBanner: boolean;
    initialUrl?: string | null;
};

export function BannerUpload({
    onFileChange,
    onRemoveBanner,
    currentFile,
    removeBanner,
    initialUrl,
}: BannerUploadProps) {
    const { t } = useTranslations();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsCompressing(true);
            try {
                // Compress banner with 1600px max width for better quality on large screens
                const result = await ImageCompressor.compress(file, {
                    maxWidth: 1600,
                    maxHeight: 1600,
                    quality: 0.85,
                    type: 'image/webp'
                });
                
                onFileChange(result.file);
                onRemoveBanner(false);
                setPreviewUrl(result.previewUrl);
            } catch (error) {
                console.error('Compression failed:', error);
                // Fallback to original file if compression fails
                onFileChange(file);
                onRemoveBanner(false);
                setPreviewUrl(URL.createObjectURL(file));
            } finally {
                setIsCompressing(false);
            }
        }
    };

    const handleRemoveClick = () => {
        onRemoveBanner(true);
        onFileChange(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const displayUrl = removeBanner ? null : previewUrl || initialUrl;

    return (
        <div className="space-y-4">
            <div 
                className="relative aspect-[4/1] w-full overflow-hidden rounded-lg border-2 border-dashed border-sidebar-border bg-sidebar-accent/30 flex items-center justify-center cursor-pointer hover:border-sidebar-border/80 transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                {displayUrl ? (
                    <img 
                        src={displayUrl} 
                        alt="Store Banner" 
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-sm font-medium">{t('Upload Banner')}</span>
                    </div>
                )}

                {isCompressing && (
                    <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center gap-2 z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-wider">{t('common.processing') || 'Processing...'}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCompressing}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    {t('Upload Banner')}
                </Button>

                {(displayUrl || currentFile) && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveClick}
                    >
                        <X className="mr-2 h-4 w-4" />
                        {t('Remove Banner')}
                    </Button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
            />

            <p className="text-xs text-muted-foreground">
                {t('Store Banner Hint')}
            </p>
        </div>
    );
}
