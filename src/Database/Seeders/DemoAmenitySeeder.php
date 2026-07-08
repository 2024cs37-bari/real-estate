<?php

namespace Zerp\RealEstate\Database\Seeders;

use Illuminate\Database\Seeder;
use Zerp\RealEstate\Models\Amenity;

class DemoAmenitySeeder extends Seeder
{
    public function run($userId): void
    {
        $amenities = ['Parking', 'Swimming Pool', 'Gym', 'Central A/C', 'Balcony', 'Security', 'Elevator', 'Garden', 'Furnished Kitchen', 'Maids Room'];

        foreach ($amenities as $name) {
            Amenity::firstOrCreate(
                ['name' => $name, 'created_by' => $userId]
            );
        }
    }
}
