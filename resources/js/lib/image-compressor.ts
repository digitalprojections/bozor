/**
 * Utility to compress and resize images in the browser using the Canvas API.
 */

interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0 to 1
    minQuality?: number;
    maxSizeBytes?: number;
    type?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export interface CompressionResult {
    file: File;
    originalSize: number;
    compressedSize: number;
    savingPercent: number;
    previewUrl: string;
}

const SUPPORTED_INPUT_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
]);

const HEIC_EXTENSIONS = /\.(heic|heif)$/i;
const SUPPORTED_EXTENSIONS = /\.(jpe?g|png|gif|webp)$/i;

export class UnsupportedImageFormatError extends Error {
    constructor(file: File) {
        super(`Unsupported image format: ${file.type || file.name}`);
        this.name = 'UnsupportedImageFormatError';
    }
}

const isSupportedInput = (file: File): boolean => {
    const type = file.type.toLowerCase();

    if (type && SUPPORTED_INPUT_TYPES.has(type)) {
        return true;
    }

    return !type && SUPPORTED_EXTENSIONS.test(file.name);
};

const isUnsupportedIphoneFormat = (file: File): boolean => {
    const type = file.type.toLowerCase();

    return type === 'image/heic' || type === 'image/heif' || HEIC_EXTENSIONS.test(file.name);
};

const blobFromCanvas = (
    canvas: HTMLCanvasElement,
    type: CompressionOptions['type'],
    quality: number,
): Promise<Blob> =>
    new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                    return;
                }

                reject(new Error('Failed to create compressed image'));
            },
            type,
            quality,
        );
    });

export class ImageCompressor {
    static async compress(
        file: File,
        options: CompressionOptions = {}
    ): Promise<CompressionResult> {
        if (isUnsupportedIphoneFormat(file) || !isSupportedInput(file)) {
            throw new UnsupportedImageFormatError(file);
        }

        const {
            maxWidth = 1280,
            maxHeight = 1280,
            quality = 0.72,
            minQuality = 0.5,
            maxSizeBytes = 1.5 * 1024 * 1024,
            type = 'image/jpeg',
        } = options;

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = async () => {
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

                    if (type === 'image/jpeg') {
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, width, height);
                    }
                    ctx.drawImage(img, 0, 0, width, height);

                    try {
                        let currentCanvas = canvas;
                        let currentQuality = quality;
                        let blob = await blobFromCanvas(
                            currentCanvas,
                            type,
                            currentQuality,
                        );

                        while (
                            blob.size > maxSizeBytes &&
                            (currentQuality > minQuality ||
                                currentCanvas.width > 900 ||
                                currentCanvas.height > 900)
                        ) {
                            if (currentQuality > minQuality) {
                                currentQuality = Math.max(
                                    minQuality,
                                    currentQuality - 0.08,
                                );
                            } else {
                                const nextCanvas = document.createElement('canvas');
                                nextCanvas.width = Math.max(
                                    1,
                                    Math.round(currentCanvas.width * 0.85),
                                );
                                nextCanvas.height = Math.max(
                                    1,
                                    Math.round(currentCanvas.height * 0.85),
                                );

                                const nextCtx = nextCanvas.getContext('2d');
                                if (!nextCtx) {
                                    throw new Error('Failed to get canvas context');
                                }

                                if (type === 'image/jpeg') {
                                    nextCtx.fillStyle = '#ffffff';
                                    nextCtx.fillRect(
                                        0,
                                        0,
                                        nextCanvas.width,
                                        nextCanvas.height,
                                    );
                                }
                                nextCtx.drawImage(
                                    currentCanvas,
                                    0,
                                    0,
                                    nextCanvas.width,
                                    nextCanvas.height,
                                );
                                currentCanvas = nextCanvas;
                            }

                            blob = await blobFromCanvas(
                                currentCanvas,
                                type,
                                currentQuality,
                            );
                        }

                        const extension = type.split('/')[1] || 'jpg';
                        const baseName = file.name.replace(/\.[^/.]+$/, '');
                        const newFileName = `${baseName}.${extension === 'jpeg' ? 'jpg' : extension}`;

                        const compressedFile = new File([blob], newFileName, {
                            type,
                            lastModified: Date.now(),
                        });

                        const previewUrl = URL.createObjectURL(blob);
                        const originalSize = file.size;
                        const compressedSize = compressedFile.size;
                        const savingPercent = Math.max(
                            0,
                            Math.round(
                                ((originalSize - compressedSize) / originalSize) *
                                    100,
                            ),
                        );

                        resolve({
                            file: compressedFile,
                            originalSize,
                            compressedSize,
                            savingPercent,
                            previewUrl,
                        });
                    } catch (error) {
                        reject(error);
                    }
                };
                img.onerror = () => reject(new Error('Failed to load image'));
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
        });
    }

    /**
     * Format bytes to human readable string
     * integers only
     */
    static formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.min(
            Math.floor(Math.log(bytes) / Math.log(k)),
            sizes.length - 1,
        );

        return `${Math.round(bytes / Math.pow(k, i))} ${sizes[i]}`;
    }
}
