import { Building2 } from 'lucide-react';

declare global {
    function route(name: string): string;
}

export const realEstateCompanyMenu = (t: (key: string) => string) => [
    {
        title: t('Real Estate Dashboard'),
        href: route('real-estate.index'),
        permission: 'manage-real-estate-dashboard',
        parent: 'dashboard',
        order: 55,
    },
    {
        title: t('Real Estate'),
        icon: Building2,
        permission: 'manage-properties',
        order: 520,
        children: [
            {
                title: t('Properties'),
                href: route('real-estate.properties.index'),
                permission: 'manage-properties',
            },
            {
                title: t('Viewings'),
                href: route('real-estate.viewings.index'),
                permission: 'manage-property-viewings',
            },
            {
                title: t('System Setup'),
                href: route('real-estate.property-types.index'),
                permission: 'manage-property-types',
                activePaths: [
                    route('real-estate.property-types.index'),
                    route('real-estate.amenities.index'),
                ],
            },
        ],
    },
];
