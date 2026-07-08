<?php

namespace Zerp\RealEstate\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class RealEstateDatabaseSeeder extends Seeder
{
    public function run()
    {
        Model::unguard();

        $this->call(PermissionTableSeeder::class);
        $this->call(MarketplaceSettingSeeder::class);

        if (config('app.run_demo_seeder')) {
            $userId = User::where('email', 'company@example.com')->first()->id;
            (new DemoPropertyTypeSeeder())->run($userId);
            (new DemoAmenitySeeder())->run($userId);
            (new DemoPropertySeeder())->run($userId);
            (new DemoPropertyViewingSeeder())->run($userId);
        }
    }
}
