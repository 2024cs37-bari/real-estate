<?php

namespace Zerp\RealEstate\Http\Controllers;

use App\Models\User;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Zerp\RealEstate\Http\Requests\StorePropertyViewingRequest;
use Zerp\RealEstate\Models\Property;
use Zerp\RealEstate\Models\PropertyViewing;

class PropertyViewingController extends Controller
{
    public function index()
    {
        if (!Auth::user()->can('manage-property-viewings')) {
            return back()->with('error', __('Permission denied'));
        }

        $viewings = PropertyViewing::with(['property:id,reference_no,title', 'agent:id,name'])
            ->where(function ($q) {
                if (Auth::user()->can('manage-any-property-viewings')) {
                    $q->where('created_by', creatorId());
                } elseif (Auth::user()->can('manage-own-property-viewings')) {
                    $q->where('creator_id', Auth::id());
                } else {
                    $q->whereRaw('1 = 0');
                }
            })
            ->when(request('status'), fn ($q) => $q->where('status', request('status')))
            ->latest('scheduled_at')
            ->paginate(request('per_page', 15))
            ->withQueryString();

        return Inertia::render('RealEstate/Viewings/Index', [
            'viewings' => $viewings,
            'properties' => Property::where('created_by', creatorId())->select('id', 'reference_no', 'title')->get(),
            'agents' => User::where('created_by', creatorId())->select('id', 'name')->get(),
            'leads' => $this->leadOptions(),
            'filters' => request()->only(['status']),
        ]);
    }

    public function store(StorePropertyViewingRequest $request)
    {
        if (!Auth::user()->can('create-property-viewings')) {
            return back()->with('error', __('Permission denied'));
        }

        $viewing = new PropertyViewing();
        $viewing->fill($request->validated());
        $viewing->creator_id = Auth::id();
        $viewing->created_by = creatorId();
        $viewing->save();

        return back()->with('success', __('Viewing scheduled successfully.'));
    }

    public function update(StorePropertyViewingRequest $request, PropertyViewing $viewing)
    {
        if (!Auth::user()->can('edit-property-viewings')) {
            return back()->with('error', __('Permission denied'));
        }

        $viewing->fill($request->validated());
        $viewing->save();

        return back()->with('success', __('Viewing updated successfully.'));
    }

    public function destroy(PropertyViewing $viewing)
    {
        if (!Auth::user()->can('delete-property-viewings')) {
            return back()->with('error', __('Permission denied'));
        }

        $viewing->delete();

        return back()->with('success', __('Viewing deleted successfully.'));
    }

    /**
     * Lead options only when the CRM (lead) module is installed — the module
     * is decoupled and works without it.
     */
    private function leadOptions()
    {
        if (!Schema::hasTable('leads')) {
            return [];
        }

        return \Illuminate\Support\Facades\DB::table('leads')
            ->where('created_by', creatorId())
            ->select('id', 'name')
            ->get();
    }
}
