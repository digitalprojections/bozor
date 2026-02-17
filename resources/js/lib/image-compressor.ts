/**
 * Utility to compress and resize images in the browser using the Canvas API.
 */

interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0 to 1
    type?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export interface CompressionResult {
    file: File;
    originalSize: number;
    compressedSize: number;
    savingPercent: number;
    previewUrl: string;
}

export class ImageCompressor {
    static async compress(
        file: File,
        options: CompressionOptions = {}
    ): Promise<CompressionResult> {
        const {
            maxWidth = 1200,
            maxHeight = 1200,
            quality = 0.8,
            type = 'image/webp',
        } = options;

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }

                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Failed to create blob'));
                                return;
                            }

                            const compressedFile = new File([blob], file.name, {
                                type: type,
                                lastModified: Date.now(),
                            });

                            const previewUrl = URL.createObjectURL(blob);
                            const originalSize = file.size;
                            const compressedSize = compressedFile.size;
                            const savingPercent = Math.round(
                                ((originalSize - compressedSize) / originalSize) * 100
                            );

                            resolve({
                                file: compressedFile,
                                originalSize,
                                compressedSize,
                                savingPercent,
                                previewUrl,
                            });
                        },
                        type,
                        quality
                    );
                };
                img.onerror = () => reject(new Error('Failed to load image'));
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
        });
    }

    /**
     * Format bytes to human readable string
     */
    static formatBytes(bytes: number, decimals: number = 2): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}
