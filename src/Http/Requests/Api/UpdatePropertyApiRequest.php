<?php

namespace Zerp\RealEstate\Http\Requests\Api;

use App\Http\Requests\ApiFormRequest;

class UpdatePropertyApiRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'property_type_id' => 'required|exists:property_types,id',
            'purpose' => 'required|in:sale,rent',
            'status' => 'required|in:available,reserved,sold,rented,off_plan',
            'price' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:8',
            'country' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'area' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'size' => 'nullable|numeric|min:0',
            'size_unit' => 'nullable|in:sqft,sqm,marla,kanal',
            'furnishing' => 'nullable|in:furnished,semi,unfurnished',
            'developer' => 'nullable|string|max:255',
            'permit_no' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'amenities' => 'nullable|array',
            'amenities.*' => 'integer|exists:amenities,id',
            'images' => 'nullable|array',
            'images.*' => 'string',
        ];
    }
}
