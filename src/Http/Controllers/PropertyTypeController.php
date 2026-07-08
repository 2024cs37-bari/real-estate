<?php

namespace Zerp\RealEstate\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Zerp\RealEstate\Models\PropertyType;

class PropertyTypeController extends Controller
{
    public function index()
    {
        if (!Auth::user()->can('manage-property-types')) {
            return back()->with('error', __('Permission denied'));
        }

        return Inertia::render('RealEstate/SystemSetup/PropertyTypes/Index', [
            'types' => PropertyType::where('created_by', creatorId())->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        if (!Auth::user()->can('create-property-types')) {
            return back()->with('error', __('Permission denied'));
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
        ]);

        PropertyType::create($data + ['created_by' => creatorId()]);

        return back()->with('success', __('Property type created successfully.'));
    }

    public function update(Request $request, PropertyType $propertyType)
    {
        if (!Auth::user()->can('edit-property-types')) {
            return back()->with('error', __('Permission denied'));
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
        ]);

        $propertyType->update($data);

        return back()->with('success', __('Property type updated successfully.'));
    }

    public function destroy(PropertyType $propertyType)
    {
        if (!Auth::user()->can('delete-property-types')) {
            return back()->with('error', __('Permission denied'));
        }

        $propertyType->delete();

        return back()->with('success', __('Property type deleted successfully.'));
    }
}
