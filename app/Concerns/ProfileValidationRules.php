<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($userId),
            'avatar' => $this->avatarRules(),
            'avatar_style' => $this->avatarStyleRules(),
            'gender' => $this->genderRules(),
            'remove_avatar' => ['nullable', 'boolean'],
            'store_name' => ['nullable', 'string', 'max:255'],
            'store_description' => ['nullable', 'string', 'max:1000'],
            'store_banner' => $this->storeBannerRules(),
            'remove_store_banner' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }

    /**
     * Get the validation rules used to validate avatar uploads.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function avatarRules(): array
    {
        return [
            'nullable',
            'image',
            'mimes:jpeg,jpg,png',
            'max:2048', // 2MB max
        ];
    }

    /**
     * Get the validation rules used to validate avatar styles.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function avatarStyleRules(): array
    {
        return [
            'nullable',
            'string',
            Rule::in([
                'initials',
                'avataaars',
                'personas',
                'lorelei',
                'micah',
                'bottts',
                'pixel-art',
                'adventurer',
                'big-smile',
            ]),
        ];
    }

    /**
     * Get the validation rules used to validate gender.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function genderRules(): array
    {
        return [
            'nullable',
            Rule::in(['male', 'female', 'other', 'unspecified']),
        ];
    }

    /**
     * Get the validation rules used to validate store banner uploads.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function storeBannerRules(): array
    {
        return [
            'nullable',
            'image',
            'mimes:jpeg,jpg,png,webp',
            'max:5120', // 5MB max
        ];
    }
}
