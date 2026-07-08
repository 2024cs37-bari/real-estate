<?php

namespace Zerp\RealEstate\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'property_type_id' => 'nullable|exists:property_types,id',
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
            'user_id' => 'nullable|exists:users,id',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'amenities' => 'nullable|array',
            'amenities.*' => 'integer|exists:amenities,id',
            'images' => 'nullable|array',
            'images.*' => 'string',
        ];
    }
}
