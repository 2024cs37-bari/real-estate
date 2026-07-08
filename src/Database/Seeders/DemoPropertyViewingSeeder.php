<?php

namespace Zerp\RealEstate\Database\Seeders;

use Illuminate\Database\Seeder;
use Zerp\RealEstate\Models\Property;
use Zerp\RealEstate\Models\PropertyViewing;

class DemoPropertyViewingSeeder extends Seeder
{
    public function run($userId): void
    {
        $properties = Property::where('created_by', $userId)->take(3)->get();

        foreach ($properties as $i => $property) {
            PropertyViewing::firstOrCreate(
                ['property_id' => $property->id, 'created_by' => $userId, 'status' => 'scheduled'],
                [
                    'user_id' => $userId,
                    'scheduled_at' => now()->addDays($i + 1)->setTime(11, 0),
                    'feedback' => null,
                    'creator_id' => $userId,
                ]
            );
        }
    }
}
