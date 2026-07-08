<?php

namespace Zerp\RealEstate\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Zerp\RealEstate\Models\Amenity;

class AmenityController extends Controller
{
    public function index()
    {
        if (!Auth::user()->can('manage-amenities')) {
            return back()->with('error', __('Permission denied'));
        }

        return Inertia::render('RealEstate/SystemSetup/Amenities/Index', [
            'amenities' => Amenity::where('created_by', creatorId())->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        if (!Auth::user()->can('create-amenities')) {
            return back()->with('error', __('Permission denied'));
        }

        $data = $request->validate(['name' => 'required|string|max:255']);
        Amenity::create($data + ['created_by' => creatorId()]);

        return back()->with('success', __('Amenity created successfully.'));
    }

    public function update(Request $request, Amenity $amenity)
    {
        if (!Auth::user()->can('edit-amenities')) {
            return back()->with('error', __('Permission denied'));
        }

        $data = $request->validate(['name' => 'required|string|max:255']);
        $amenity->update($data);

        return back()->with('success', __('Amenity updated successfully.'));
    }

    public function destroy(Amenity $amenity)
    {
        if (!Auth::user()->can('delete-amenities')) {
            return back()->with('error', __('Permission denied'));
        }

        $amenity->delete();

        return back()->with('success', __('Amenity deleted successfully.'));
    }
}
