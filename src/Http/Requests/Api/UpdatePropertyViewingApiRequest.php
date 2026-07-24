<?php

namespace Zerp\RealEstate\Http\Requests\Api;

use App\Http\Requests\ApiFormRequest;

class UpdatePropertyViewingApiRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'property_id' => 'required|exists:properties,id',
            'lead_id' => 'nullable|integer',
            'scheduled_at' => 'required|date',
            'status' => 'required|in:scheduled,completed,cancelled,no_show',
            'feedback' => 'nullable|string',
        ];
    }
}
