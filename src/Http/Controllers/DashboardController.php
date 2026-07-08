<?php

namespace Zerp\RealEstate\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Zerp\RealEstate\Models\Property;
use Zerp\RealEstate\Models\PropertyViewing;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        if (!Auth::user()->can('manage-real-estate-dashboard')) {
            return back()->with('error', __('Permission denied'));
        }

        $base = Property::where('created_by', creatorId());

        $stats = [
            'total' => (clone $base)->count(),
            'available' => (clone $base)->where('status', 'available')->count(),
            'sold_rented' => (clone $base)->whereIn('status', ['sold', 'rented'])->count(),
            'off_plan' => (clone $base)->where('status', 'off_plan')->count(),
        ];

        $byType = Property::where('created_by', creatorId())
            ->selectRaw('property_type_id, count(*) as total')
            ->with('type:id,name')
            ->groupBy('property_type_id')
            ->get()
            ->map(fn ($row) => ['name' => $row->type->name ?? __('Unspecified'), 'total' => $row->total]);

        $upcomingViewings = PropertyViewing::with(['property:id,reference_no,title', 'agent:id,name'])
            ->where('created_by', creatorId())
            ->where('status', 'scheduled')
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at')
            ->take(5)
            ->get();

        return Inertia::render('RealEstate/Dashboard/CompanyDashboard', [
            'stats' => $stats,
            'by_type' => $byType,
            'upcoming_viewings' => $upcomingViewings,
        ]);
    }
}
