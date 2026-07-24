<?php

namespace Zerp\RealEstate\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Zerp\RealEstate\Models\Property;
use Zerp\RealEstate\Models\PropertyViewing;

class DashboardApiController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        try {
            if (!Auth::user()->can('manage-real-estate-dashboard')) {
                return $this->errorResponse(__('Permission denied'), null, 403);
            }

            $creatorId = creatorId();

            $totalProperties = Property::where('created_by', $creatorId)->count();
            $availableProperties = Property::where('created_by', $creatorId)->where('status', 'available')->count();
            $forSaleCount = Property::where('created_by', $creatorId)->where('purpose', 'sale')->count();
            $forRentCount = Property::where('created_by', $creatorId)->where('purpose', 'rent')->count();
            $scheduledViewings = PropertyViewing::where('created_by', $creatorId)->where('status', 'scheduled')->count();

            $recentProperties = Property::where('created_by', $creatorId)
                ->with(['propertyType', 'images'])
                ->latest()
                ->limit(5)
                ->get();

            return $this->successResponse([
                'stats' => [
                    'total_properties' => $totalProperties,
                    'available_properties' => $availableProperties,
                    'for_sale_count' => $forSaleCount,
                    'for_rent_count' => $forRentCount,
                    'scheduled_viewings' => $scheduledViewings,
                ],
                'recent_properties' => $recentProperties,
            ], __('Dashboard retrieved successfully'));
        } catch (\Exception $e) {
            Log::error('RealEstate Dashboard API error', ['e' => $e]);
            return $this->errorResponse(__('Something went wrong'), null, 500);
        }
    }
}
