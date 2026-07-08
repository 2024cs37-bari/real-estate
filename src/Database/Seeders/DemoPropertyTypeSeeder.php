<?php

namespace Zerp\RealEstate\Database\Seeders;

use Illuminate\Database\Seeder;
use Zerp\RealEstate\Models\PropertyType;

class DemoPropertyTypeSeeder extends Seeder
{
    public function run($userId): void
    {
        $types = ['Apartment', 'Villa', 'Townhouse', 'Office', 'Shop', 'Plot', 'Warehouse'];

        foreach ($types as $name) {
            PropertyType::firstOrCreate(
                ['name' => $name, 'created_by' => $userId]
            );
        }
    }
}
