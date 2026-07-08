<?php

namespace Zerp\RealEstate\Database\Seeders;

use Illuminate\Database\Seeder;
use Zerp\RealEstate\Models\Amenity;
use Zerp\RealEstate\Models\Property;
use Zerp\RealEstate\Models\PropertyType;

class DemoPropertySeeder extends Seeder
{
    public function run($userId): void
    {
        $types = PropertyType::where('created_by', $userId)->pluck('id', 'name');
        $amenityIds = Amenity::where('created_by', $userId)->pluck('id')->all();

        $demo = [
            ['title' => '2BR Apartment in City Center', 'type' => 'Apartment', 'purpose' => 'rent', 'status' => 'available', 'price' => 85000, 'city' => 'Lahore', 'area' => 'Gulberg', 'beds' => 2, 'baths' => 2, 'size' => 1200, 'unit' => 'sqft'],
            ['title' => 'Luxury Villa with Pool', 'type' => 'Villa', 'purpose' => 'sale', 'status' => 'available', 'price' => 45000000, 'city' => 'Karachi', 'area' => 'DHA Phase 6', 'beds' => 5, 'baths' => 6, 'size' => 1, 'unit' => 'kanal'],
            ['title' => 'Corporate Office Floor', 'type' => 'Office', 'purpose' => 'rent', 'status' => 'reserved', 'price' => 350000, 'city' => 'Islamabad', 'area' => 'Blue Area', 'beds' => 0, 'baths' => 2, 'size' => 3000, 'unit' => 'sqft'],
            ['title' => 'Off-plan Townhouse', 'type' => 'Townhouse', 'purpose' => 'sale', 'status' => 'off_plan', 'price' => 22000000, 'city' => 'Lahore', 'area' => 'Bahria Town', 'beds' => 4, 'baths' => 4, 'size' => 10, 'unit' => 'marla'],
        ];

        foreach ($demo as $row) {
            $property = Property::firstOrCreate(
                ['title' => $row['title'], 'created_by' => $userId],
                [
                    'reference_no' => Property::nextReferenceNo($userId),
                    'property_type_id' => $types[$row['type']] ?? null,
                    'purpose' => $row['purpose'],
                    'status' => $row['status'],
                    'price' => $row['price'],
                    'currency' => 'PKR',
                    'country' => 'Pakistan',
                    'city' => $row['city'],
                    'area' => $row['area'],
                    'bedrooms' => $row['beds'],
                    'bathrooms' => $row['baths'],
                    'size' => $row['size'],
                    'size_unit' => $row['unit'],
                    'description' => 'Demo listing seeded for the Real Estate module.',
                    'user_id' => $userId,
                    'is_active' => true,
                    'creator_id' => $userId,
                ]
            );

            if ($amenityIds && $property->wasRecentlyCreated) {
                $property->amenities()->sync(array_slice($amenityIds, 0, 4));
            }
        }
    }
}
