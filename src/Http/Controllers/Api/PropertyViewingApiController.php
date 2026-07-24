<?php

namespace Zerp\RealEstate\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Zerp\RealEstate\Models\PropertyViewing;
use Zerp\RealEstate\Http\Requests\Api\StorePropertyViewingApiRequest;
use Zerp\RealEstate\Http\Requests\Api\UpdatePropertyViewingApiRequest;

class PropertyViewingApiController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        try {
            if (!Auth::user()->can('manage-property-viewings')) {
                return $this->errorResponse(__('Permission denied'), null, 403);
            }

            $viewings = PropertyViewing::query()
                ->with(['property'])
                ->where(function($q) {
                    if (Auth::user()->can('manage-any-property-viewings')) {
                        $q->where('created_by', creatorId());
                    } elseif (Auth::user()->can('manage-own-property-viewings')) {
                        $q->where('creator_id', Auth::id());
                    } else {
                        $q->whereRaw('1 = 0');
                    }
                })
                ->when($request->property_id, fn($q) => $q->where('property_id', $request->property_id))
                ->when($request->status, fn($q) => $q->where('status', $request->status))
                ->latest()
                ->paginate($request->get('per_page', 10))
                ->withQueryString();

            return $this->paginatedResponse($viewings, __('Property viewings retrieved successfully'));
        } catch (\Exception $e) {
            Log::error('PropertyViewing API index error', ['e' => $e]);
            return $this->errorResponse(__('Something went wrong'), null, 500);
        }
    }

    public function store(StorePropertyViewingApiRequest $request)
    {
        try {
            if (!Auth::user()->can('create-property-viewings')) {
                return $this->errorResponse(__('Permission denied'), null, 403);
            }

            $validated = $request->validated();

            $viewing = new PropertyViewing();
            $viewing->property_id = $validated['property_id'];
            $viewing->lead_id = $validated['lead_id'] ?? null;
            $viewing->scheduled_at = $validated['scheduled_at'];
            $viewing->status = $validated['status'];
            $viewing->feedback = $validated['feedback'] ?? null;
            $viewing->creator_id = Auth::id();
            $viewing->created_by = creatorId();
            $viewing->save();

            return $this->successResponse($viewing->load('property'), __('Property viewing scheduled successfully'), 201);
        } catch (\Exception $e) {
            Log::error('PropertyViewing API store error', ['e' => $e]);
            return $this->errorResponse(__('Something went wrong'), null, 500);
        }
    }

    public function show($id)
    {
        try {
            if (!Auth::user()->can('manage-property-viewings')) {
                return $this->errorResponse(__('Permission denied'), null, 403);
            }

            $viewing = PropertyViewing::with(['property'])
                ->where('id', $id)
                ->where(function($q) {
                    if (Auth::user()->can('manage-any-property-viewings')) {
                        $q->where('created_by', creatorId());
                    } elseif (Auth::user()->can('manage-own-property-viewings')) {
                        $q->where('creator_id', Auth::id());
                    } else {
                        $q->whereRaw('1 = 0');
                    }
                })
                ->first();

            if (!$viewing) {
                return $this->errorResponse(__('Property viewing not found'), null, 404);
            }

            return $this->successResponse($viewing, __('Property viewing details retrieved successfully'));
        } catch (\Exception $e) {
            Log::error('PropertyViewing API show error', ['e' => $e]);
            return $this->errorResponse(__('Something went wrong'), null, 500);
        }
    }

    public function update(UpdatePropertyViewingApiRequest $request, $id)
    {
        try {
            if (!Auth::user()->can('edit-property-viewings')) {
                return $this->errorResponse(__('Permission denied'), null, 403);
            }

            $viewing = PropertyViewing::where('id', $id)
                ->where('created_by', creatorId())
                ->first();

            if (!$viewing) {
                return $this->errorResponse(__('Property viewing not found'), null, 404);
            }

            $validated = $request->validated();

            $viewing->property_id = $validated['property_id'];
            $viewing->lead_id = $validated['lead_id'] ?? null;
            $viewing->scheduled_at = $validated['scheduled_at'];
            $viewing->status = $validated['status'];
            $viewing->feedback = $validated['feedback'] ?? null;
            $viewing->save();

            return $this->successResponse($viewing->load('property'), __('Property viewing updated successfully'));
        } catch (\Exception $e) {
            Log::error('PropertyViewing API update error', ['e' => $e]);
            return $this->errorResponse(__('Something went wrong'), null, 500);
        }
    }

    public function destroy($id)
    {
        try {
            if (!Auth::user()->can('delete-property-viewings')) {
                return $this->errorResponse(__('Permission denied'), null, 403);
            }

            $viewing = PropertyViewing::where('id', $id)
                ->where('created_by', creatorId())
                ->first();

            if (!$viewing) {
                return $this->errorResponse(__('Property viewing not found'), null, 404);
            }

            $viewing->delete();

            return $this->successResponse(null, __('Property viewing deleted successfully'));
        } catch (\Exception $e) {
            Log::error('PropertyViewing API destroy error', ['e' => $e]);
            return $this->errorResponse(__('Something went wrong'), null, 500);
        }
    }
}
