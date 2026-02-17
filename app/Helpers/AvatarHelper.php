<?php

namespace App\Helpers;

use App\Models\User;
use Illuminate\Support\Facades\Storage;

class AvatarHelper
{
    /**
     * Generate avatar URL for a user using DiceBear API
     */
    public static function generateAvatarUrl(User $user, ?string $style = null): string
    {
        $style = $style ?? $user->avatar_style ?? 'initials';
        $seed = $user->avatar_seed ?? $user->email;
        
        $baseUrl = "https://api.dicebear.com/7.x/{$style}/svg";
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
        // If user has uploaded avatar, use it
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            return Storage::disk('public')->url($user->avatar);
        }
        
        // Otherwise, generate avatar
        return self::generateAvatarUrl($user);
    }
}
