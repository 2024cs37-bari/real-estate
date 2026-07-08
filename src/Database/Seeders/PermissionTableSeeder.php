<?php

namespace Zerp\RealEstate\Database\Seeders;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Artisan;

class PermissionTableSeeder extends Seeder
{
    public function run()
    {
        Model::unguard();
        Artisan::call('cache:clear');

        $permission = [
            ['name' => 'manage-real-estate-dashboard', 'module' => 'real-estate', 'label' => 'Manage Real Estate Dashboard'],
        ];

        // properties, property-viewings, property-types, amenities all get the
        // standard manage/any/own/view/create/edit/delete set.
        $crudGroups = [
            'properties' => 'Properties',
            'property-viewings' => 'Property Viewings',
            'property-types' => 'Property Types',
            'amenities' => 'Amenities',
        ];

        foreach ($crudGroups as $module => $label) {
            $permission[] = ['name' => "manage-{$module}", 'module' => $module, 'label' => "Manage {$label}"];
            $permission[] = ['name' => "manage-any-{$module}", 'module' => $module, 'label' => "Manage All {$label}"];
            $permission[] = ['name' => "manage-own-{$module}", 'module' => $module, 'label' => "Manage Own {$label}"];
            $permission[] = ['name' => "view-{$module}", 'module' => $module, 'label' => "View {$label}"];
            $permission[] = ['name' => "create-{$module}", 'module' => $module, 'label' => "Create {$label}"];
            $permission[] = ['name' => "edit-{$module}", 'module' => $module, 'label' => "Edit {$label}"];
            $permission[] = ['name' => "delete-{$module}", 'module' => $module, 'label' => "Delete {$label}"];
        }

        $company_role = Role::where('name', 'company')->first();

        foreach ($permission as $perm) {
            $permission_obj = Permission::firstOrCreate(
                ['name' => $perm['name'], 'guard_name' => 'web'],
                [
                    'module' => $perm['module'],
                    'label' => $perm['label'],
                    'add_on' => 'Real Estate',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            if ($company_role && !$company_role->hasPermissionTo($permission_obj)) {
                $company_role->givePermissionTo($permission_obj);
            }
        }
    }
}
