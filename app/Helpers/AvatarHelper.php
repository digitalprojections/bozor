<?php

namespace App\Helpers;

use App\Models\User;
use Illuminate\Support\Facades\Storage;

class AvatarHelper
{
    private static function isRemoteUrl(?string $value): bool
    {
        return $value && (str_starts_with($value, 'http://') || str_starts_with($value, 'https://'));
    }

    /**
     * Generate avatar URL for a user using DiceBear API
     */
    public static function generateAvatarUrl(User $user, ?string $style = null): string
    {
        $style = $style ?? $user->avatar_style ?? 'initials';
        $seed = $user->avatar_seed ?? $user->email ?? $user->guest_id ?? 'guest';
        
        // Use bottts as a fallback for mascot style when using DiceBear API
        $diceBearStyle = ($style === 'mascot') ? 'bottts' : $style;
        
        $baseUrl = "https://api.dicebear.com/7.x/{$diceBearStyle}/svg";
        $params = ['seed' => urlencode($seed)];
        
        // Add gender parameter for styles that support it
        if ($user->gender && in_array($style, ['avataaars', 'personas', 'lorelei', 'micah'])) {
            $params['gender'] = $user->gender;
        }
        
        // Add background color for initials style
        if ($style === 'initials') {
            $params['backgroundColor'] = self::generateColorFromSeed($seed);
        }
        
        $queryString = http_build_query($params);
        return "{$baseUrl}?{$queryString}";
    }
    
    /**
     * Generate a consistent color from a seed string
     */
    private static function generateColorFromSeed(string $seed): string
    {
        $colors = [
            '3b82f6', // blue
            '8b5cf6', // purple
            'ec4899', // pink
            'f59e0b', // amber
            '10b981', // emerald
            '06b6d4', // cyan
            'f97316', // orange
            '6366f1', // indigo
        ];
        
        $hash = crc32($seed);
        $index = abs($hash) % count($colors);
        
        return $colors[$index];
    }
    
    /**
     * Get avatar URL with fallback to generated avatar
     */
    public static function getAvatarUrl(User $user): string
    {
        $uploadedAvatarUrl = function () use ($user): ?string {
            if (! $user->avatar || self::isRemoteUrl($user->avatar) || ! Storage::disk('public')->exists($user->avatar)) {
                return null;
            }

            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = Storage::disk('public');
            return $disk->url($user->avatar);
        };

        return match ($user->avatar_source) {
            'uploaded' => $uploadedAvatarUrl() ?? self::generateAvatarUrl($user),
            'mascot', 'generated' => self::generateAvatarUrl($user),
            'google' => $user->google_avatar ?: (self::isRemoteUrl($user->avatar) ? $user->avatar : self::generateAvatarUrl($user)),
            default => $uploadedAvatarUrl()
                ?? (self::isRemoteUrl($user->avatar) ? $user->avatar : null)
                ?? $user->google_avatar
                ?? self::generateAvatarUrl($user),
        };
    }

    /**
     * Check whether the stored avatar is a local upload.
     */
    public static function hasUploadedAvatar(User $user): bool
    {
        return (bool) ($user->avatar && ! self::isRemoteUrl($user->avatar));
    }

    /**
     * Check whether the stored avatar is a remote URL.
     */
    public static function hasRemoteAvatar(User $user): bool
    {
        return self::isRemoteUrl($user->avatar);
    }

    /**
     * Check whether a string is a remote URL.
     */
    public static function isRemoteAvatar(?string $value): bool
    {
        return self::isRemoteUrl($value);
    }
}
