<?php

namespace Zerp\RealEstate\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Zerp\RealEstate\Models\Property;
use Zerp\RealEstate\Http\Requests\Api\StorePropertyApiRequest;
use Zerp\RealEstate\Http\Requests\Api\UpdatePropertyApiRequest;

class PropertyApiController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        try {
            if (!Auth::user()->can('manage-properties')) {
                return $this->errorResponse(__('Permission denied'), null, 403);
            }

            $properties = Property::query()
                ->with(['propertyType', 'amenities', 'images'])
                ->where(function($q) {
                    if (Auth::user()->can('manage-any-properties')) {
                        $q->where('created_by', creatorId());
                    } elseif (Auth::user()->can('manage-own-properties')) {
                        $q->where('creator_id', Auth::id());
                    } else {
                        $q->whereRaw('1 = 0');
                    }
                })
                ->when($request->search, function($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->search . '%')
                      ->orWhere('city', 'like', '%' . $request->search . '%')
                      ->orWhere('address', 'like', '%' . $request->search . '%');
                })
                ->when($request->purpose, fn($q) => $q->where('purpose', $request->purpose))
                ->when($request->status, fn($q) => $q->where('status', $request->status))
                ->when($request->property_type_id, fn($q) => $q->where('property_type_id', $request->property_type_id))
                ->latest()
                ->paginate($request->get('per_page', 10))
                ->withQueryString();

            return $this->paginatedResponse($properties, __('Properties retrieved successfully'));
        } catch (\Exception $e) {
            Log::error('Property API index error', ['e' => $e]);
            return $this->errorResponse(__('Something went wrong'), null, 500);
        }
    }

    public function store(StorePropertyApiRequest $request)
    {
        try {
            if (!Auth::user()->can('create-properties')) {
                return $this->errorResponse(__('Permission denied'), null, 403);
            }

            $validated = $request->validated();

            $property = new Property();
            $property->title = $validated['title'];
            $property->property_type_id = $validated['property_type_id'];
            $property->purpose = $validated['purpose'];
            $property->status = $validated['status'];
            $property->price = $validated['price'];
            $property->currency = $validated['currency'] ?? 'USD';
            $property->country = $validated['country'] ?? null;
            $property->city = $validated['city'] ?? null;
            $property->area = $validated['area'] ?? null;
            $property->address = $validated['address'] ?? null;
            $property->bedrooms = $validated['bedrooms'] ?? null;
            $property->bathrooms = $validated['bathrooms'] ?? null;
            $property->size = $validated['size'] ?? null;
            $property->size_unit = $validated['size_unit'] ?? 'sqft';
            $property->furnishing = $validated['furnishing'] ?? null;
            $property->developer = $validated['developer'] ?? null;
            $property->permit_no = $validated['permit_no'] ?? null;
            $property->description = $validated['description'] ?? null;
            $property->is_active = $request->boolean('is_active', true);
            $property->is_featured = $request->boolean('is_featured', false);
            $property->creator_id = Auth::id();
            $property->created_by = creatorId();
            $property->save();

            if (!empty($validated['amenities'])) {
                $property->amenities()->sync($validated['amenities']);
            }

            return $this->successResponse($property->load(['propertyType', 'amenities']), __('Property created successfully'), 201);
        } catch (\Exception $e) {
            Log::error('Property API store error', ['e' => $e]);
            return $this->errorResponse(__('Something went wrong'), null, 500);
        }
    }

    public function show($id)
    {
        try {
            if (!Auth::user()->can('manage-properties')) {
                return $this->errorResponse(__('Permission denied'), null, 403);
            }

            $property = Property::with(['propertyType', 'amenities', 'images'])
                ->where('id', $id)
                ->where(function($q) {
                    if (Auth::user()->can('manage-any-properties')) {
                        $q->where('created_by', creatorId());
                    } elseif (Auth::user()->can('manage-own-properties')) {
                        $q->where('creator_id', Auth::id());
                    } else {
                        $q->whereRaw('1 = 0');
                    }
                })
                ->first();

            if (!$property) {
                return $this->errorResponse(__('Property not found'), null, 404);
            }

            return $this->successResponse($property, __('Property details retrieved successfully'));
        } catch (\Exception $e) {
            Log::error('Property API show error', ['e' => $e]);
            return $this->errorResponse(__('Something went wrong'), null, 500);
        }
    }

    public function update(UpdatePropertyApiRequest $request, $id)
    {
        try {
            if (!Auth::user()->can('edit-properties')) {
                return $this->errorResponse(__('Permission denied'), null, 403);
            }

            $property = Property::where('id', $id)
                ->where('created_by', creatorId())
                ->first();

            if (!$property) {
                return $this->errorResponse(__('Property not found'), null, 404);
            }

            $validated = $request->validated();

            $property->title = $validated['title'];
            $property->property_type_id = $validated['property_type_id'];
            $property->purpose = $validated['purpose'];
            $property->status = $validated['status'];
            $property->price = $validated['price'];
            $property->currency = $validated['currency'] ?? 'USD';
            $property->country = $validated['country'] ?? null;
            $property->city = $validated['city'] ?? null;
            $property->area = $validated['area'] ?? null;
            $property->address = $validated['address'] ?? null;
            $property->bedrooms = $validated['bedrooms'] ?? null;
            $property->bathrooms = $validated['bathrooms'] ?? null;
            $property->size = $validated['size'] ?? null;
            $property->size_unit = $validated['size_unit'] ?? 'sqft';
            $property->furnishing = $validated['furnishing'] ?? null;
            $property->developer = $validated['developer'] ?? null;
            $property->permit_no = $validated['permit_no'] ?? null;
            $property->description = $validated['description'] ?? null;
            $property->is_active = $request->boolean('is_active', true);
            $property->is_featured = $request->boolean('is_featured', false);
            $property->save();

            if (isset($validated['amenities'])) {
                $property->amenities()->sync($validated['amenities']);
            }

            return $this->successResponse($property->load(['propertyType', 'amenities']), __('Property updated successfully'));
        } catch (\Exception $e) {
            Log::error('Property API update error', ['e' => $e]);
            return $this->errorResponse(__('Something went wrong'), null, 500);
        }
    }

    public function destroy($id)
    {
        try {
            if (!Auth::user()->can('delete-properties')) {
                return $this->errorResponse(__('Permission denied'), null, 403);
            }

            $property = Property::where('id', $id)
                ->where('created_by', creatorId())
                ->first();

            if (!$property) {
                return $this->errorResponse(__('Property not found'), null, 404);
            }

            $property->delete();

            return $this->successResponse(null, __('Property deleted successfully'));
        } catch (\Exception $e) {
            Log::error('Property API destroy error', ['e' => $e]);
            return $this->errorResponse(__('Something went wrong'), null, 500);
        }
    }
}
