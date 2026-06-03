<?php

namespace App\Http\Requests\Settings;

use App\Concerns\PasswordValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PasswordUpdateRequest extends FormRequest
{
    use PasswordValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'current_password' => $this->requiresCurrentPassword()
                ? $this->currentPasswordRules()
                : ['nullable'],
            'password' => $this->passwordRules(),
        ];
    }

    private function requiresCurrentPassword(): bool
    {
        return (bool) $this->user()?->has_local_password
            && $this->session()->get('auth.login_provider') !== 'google';
    }
}
