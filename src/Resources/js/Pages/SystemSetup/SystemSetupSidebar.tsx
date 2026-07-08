import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Home, Star } from 'lucide-react';

interface SidebarItem {
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    route: string;
    permission: string;
}

export default function SystemSetupSidebar({ activeItem }: { activeItem?: string }) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const currentRoute = route().current();

    const sidebarItems: SidebarItem[] = [
        { key: 'property-types', label: t('Property Types'), icon: Home, route: 'real-estate.property-types.index', permission: 'manage-property-types' },
        { key: 'amenities', label: t('Amenities'), icon: Star, route: 'real-estate.amenities.index', permission: 'manage-amenities' },
    ];

    const filteredItems = sidebarItems.filter((item) => auth.user?.permissions?.includes(item.permission));

    return (
        <div className="sticky top-4">
            <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="pr-4 space-y-1">
                    {filteredItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.key || currentRoute === item.route;
                        return (
                            <Button key={item.key} variant="ghost"
                                className={cn('w-full justify-start', { 'bg-muted font-medium': isActive })}
                                onClick={() => router.get(route(item.route))}>
                                <Icon className="h-4 w-4 mr-2" />
                                {item.label}
                            </Button>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
