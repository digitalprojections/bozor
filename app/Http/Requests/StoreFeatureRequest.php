<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && ! $this->user()->is_guest && ! $this->user()->disabled_at;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => __('feature_requests.title_required'),
            'title.string' => __('feature_requests.title_required'),
            'title.max' => __('feature_requests.title_max'),
            'description.required' => __('feature_requests.description_required'),
            'description.string' => __('feature_requests.description_required'),
            'description.max' => __('feature_requests.description_max'),
        ];
    }
}
