<?php

namespace Zerp\RealEstate\Database\Seeders;

use Illuminate\Database\Seeder;
use Zerp\LandingPage\Models\MarketplaceSetting;
use Illuminate\Support\Facades\File;

class MarketplaceSettingSeeder extends Seeder
{
    public function run()
    {
        $marketplaceDir = __DIR__ . '/../../marketplace';
        $screenshots = [];

        if (File::exists($marketplaceDir)) {
            $files = File::files($marketplaceDir);
            foreach ($files as $file) {
                if (in_array($file->getExtension(), ['png', 'jpg', 'jpeg', 'gif', 'webp'])) {
                    $screenshots[] = '/packages/local/RealEstate/src/marketplace/' . $file->getFilename();
                }
            }
        }

        sort($screenshots);

        MarketplaceSetting::firstOrCreate(['module' => 'RealEstate'], [
            'module' => 'RealEstate',
            'title' => 'Real Estate Module Marketplace',
            'subtitle' => 'Property listings and viewings for real estate brokerages',
            'config_sections' => [
                'sections' => [
                    'hero' => [
                        'variant' => 'hero1',
                        'title' => 'Real Estate Module for Zerp',
                        'subtitle' => 'Manage your property inventory, listings, and viewings in one connected platform.',
                        'primary_button_text' => 'Install Real Estate Module',
                        'primary_button_link' => '#install',
                        'secondary_button_text' => 'Learn More',
                        'secondary_button_link' => '#learn',
                        'image' => '',
                    ],
                    'modules' => [
                        'variant' => 'modules1',
                        'title' => 'Real Estate Module',
                        'subtitle' => 'Enhance your brokerage workflow with property management tools',
                    ],
                    'dedication' => [
                        'variant' => 'dedication1',
                        'title' => 'Dedicated Real Estate Features',
                        'description' => 'Our real estate module provides property listing and viewing management built for brokerages.',
                        'subSections' => [
                            [
                                'title' => 'Property Database',
                                'description' => 'Centralized inventory with images, pricing, and availability.',
                                'keyPoints' => ['Listings', 'Images', 'Pricing', 'Availability'],
                                'screenshot' => '/packages/local/RealEstate/src/marketplace/image1.png',
                            ],
                            [
                                'title' => 'Property Viewings',
                                'description' => 'Schedule and track viewings against listings and leads.',
                                'keyPoints' => ['Schedule', 'Track', 'Feedback', 'Agents'],
                                'screenshot' => '/packages/local/RealEstate/src/marketplace/image2.png',
                            ],
                            [
                                'title' => 'Agent Assignment',
                                'description' => 'Assign properties to agents and track their inventory.',
                                'keyPoints' => ['Assign', 'Track', 'Report', 'Manage'],
                                'screenshot' => '/packages/local/RealEstate/src/marketplace/image3.png',
                            ],
                        ],
                    ],
                    'screenshots' => [
                        'variant' => 'screenshots1',
                        'title' => 'Real Estate Module in Action',
                        'subtitle' => 'See how our property tools improve your brokerage workflow',
                        'images' => $screenshots,
                    ],
                    'why_choose' => [
                        'variant' => 'whychoose1',
                        'title' => 'Why Choose the Real Estate Module?',
                        'subtitle' => 'Run your brokerage inventory with comprehensive property management',
                        'benefits' => [
                            [
                                'title' => 'Central Inventory',
                                'description' => 'Keep every listing in one place with full detail and media.',
                                'icon' => 'Building2',
                                'color' => 'blue',
                            ],
                            [
                                'title' => 'Viewing Tracking',
                                'description' => 'Never lose track of a scheduled viewing or its outcome.',
                                'icon' => 'CalendarCheck',
                                'color' => 'green',
                            ],
                            [
                                'title' => 'CRM Integrated',
                                'description' => 'Link viewings to CRM leads for a full inquiry-to-close flow.',
                                'icon' => 'Contact',
                                'color' => 'purple',
                            ],
                            [
                                'title' => 'Market Flexible',
                                'description' => 'Configurable currency and size units for any local market.',
                                'icon' => 'Globe',
                                'color' => 'red',
                            ],
                            [
                                'title' => 'Agent Productivity',
                                'description' => 'Assign inventory to agents and measure their pipeline.',
                                'icon' => 'Users',
                                'color' => 'yellow',
                            ],
                            [
                                'title' => 'Easy Integration',
                                'description' => 'Seamlessly integrate with your existing Zerp workflow.',
                                'icon' => 'GitBranch',
                                'color' => 'indigo',
                            ],
                        ],
                    ],
                ],
                'section_visibility' => [
                    'header' => true,
                    'hero' => true,
                    'modules' => true,
                    'dedication' => true,
                    'screenshots' => true,
                    'why_choose' => true,
                    'cta' => true,
                    'footer' => true,
                ],
                'section_order' => ['header', 'hero', 'modules', 'dedication', 'screenshots', 'why_choose', 'cta', 'footer'],
            ],
        ]);
    }
}
