import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, CheckCircle, Handshake, Hammer } from 'lucide-react';
import { formatDateTime } from '@/utils/helpers';

interface PageProps {
    stats: { total: number; available: number; sold_rented: number; off_plan: number };
    by_type: { name: string; total: number }[];
    upcoming_viewings: any[];
    [key: string]: any;
}

export default function CompanyDashboard() {
    const { t } = useTranslation();
    const { stats, by_type, upcoming_viewings } = usePage<PageProps>().props;

    const tiles = [
        { label: t('Total Properties'), value: stats.total, icon: Building2, color: 'text-blue-600' },
        { label: t('Available'), value: stats.available, icon: CheckCircle, color: 'text-green-600' },
        { label: t('Sold / Rented'), value: stats.sold_rented, icon: Handshake, color: 'text-gray-600' },
        { label: t('Off-plan'), value: stats.off_plan, icon: Hammer, color: 'text-amber-600' },
    ];

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Real Estate') }, { label: t('Dashboard') }]} pageTitle={t('Real Estate Dashboard')}>
            <Head title={t('Real Estate Dashboard')} />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {tiles.map((tile) => {
                    const Icon = tile.icon;
                    return (
                        <Card key={tile.label} className="shadow-sm"><CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-500">{tile.label}</div>
                                <div className="text-2xl font-semibold">{tile.value}</div>
                            </div>
                            <Icon className={`h-8 w-8 ${tile.color}`} />
                        </CardContent></Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm"><CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">{t('Properties by Type')}</h3>
                    {by_type.length > 0 ? (
                        <div className="space-y-2">
                            {by_type.map((row) => (
                                <div key={row.name} className="flex justify-between text-sm border-b pb-2">
                                    <span>{row.name}</span>
                                    <Badge variant="outline">{row.total}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-gray-400">{t('No properties yet.')}</p>}
                </CardContent></Card>

                <Card className="shadow-sm"><CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">{t('Upcoming Viewings')}</h3>
                    {upcoming_viewings.length > 0 ? (
                        <div className="space-y-2">
                            {upcoming_viewings.map((v) => (
                                <div key={v.id} className="flex justify-between text-sm border-b pb-2">
                                    <div>
                                        <div className="font-medium">{v.property?.title ?? '-'}</div>
                                        <div className="text-xs text-gray-500">{v.agent?.name}</div>
                                    </div>
                                    <span className="text-gray-600">{v.scheduled_at ? formatDateTime(v.scheduled_at) : '-'}</span>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-gray-400">{t('No upcoming viewings.')}</p>}
                </CardContent></Card>
            </div>
        </AuthenticatedLayout>
    );
}
