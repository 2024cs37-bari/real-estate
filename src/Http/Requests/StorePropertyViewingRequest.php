<?php

namespace Zerp\RealEstate\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyViewingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'property_id' => 'required|exists:properties,id',
            'lead_id' => 'nullable|integer',
            'user_id' => 'nullable|exists:users,id',
            'scheduled_at' => 'required|date',
            'status' => 'required|in:scheduled,completed,cancelled,no_show',
            'feedback' => 'nullable|string',
        ];
    }
}
