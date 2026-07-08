import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, MapPin, BedDouble, Bath, Ruler } from 'lucide-react';
import { formatCurrency, getImagePath, formatDateTime } from '@/utils/helpers';
import { Property } from './types';

interface PageProps {
    property: Property;
    auth: { user?: { permissions?: string[] } };
    [key: string]: any;
}

export default function Show() {
    const { t } = useTranslation();
    const { property, auth } = usePage<PageProps>().props;
    const can = (p: string) => auth.user?.permissions?.includes(p);

    const detail = (label: string, value: any) => value ? (
        <div><div className="text-xs text-gray-500">{label}</div><div className="font-medium">{value}</div></div>
    ) : null;

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Real Estate'), url: route('real-estate.properties.index') },
                { label: t('Properties'), url: route('real-estate.properties.index') },
                { label: property.reference_no },
            ]}
            pageTitle={property.title}
        >
            <Head title={property.title} />

            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-500">{property.reference_no}</span>
                    <Badge>{t(property.status.replace('_', ' '))}</Badge>
                    <Badge variant="outline">{t(property.purpose)}</Badge>
                </div>
                {can('edit-properties') && (
                    <Button onClick={() => router.get(route('real-estate.properties.edit', property.id))}>
                        <Edit className="h-4 w-4 mr-1" /> {t('Edit')}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {property.images && property.images.length > 0 && (
                        <Card><CardContent className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {property.images.map((img) => (
                                    <img key={img.id} src={getImagePath(img.file_path || '')} alt="" className="rounded-md object-cover w-full h-32" />
                                ))}
                            </div>
                        </CardContent></Card>
                    )}

                    <Card><CardContent className="p-6 space-y-4">
                        <div className="text-2xl font-semibold">
                            {property.currency ? `${property.currency} ` : ''}{formatCurrency(property.price)}
                        </div>
                        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                            {property.bedrooms != null && <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" /> {property.bedrooms} {t('Beds')}</span>}
                            {property.bathrooms != null && <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {property.bathrooms} {t('Baths')}</span>}
                            {property.size != null && <span className="flex items-center gap-1"><Ruler className="h-4 w-4" /> {property.size} {property.size_unit}</span>}
                            {(property.area || property.city) && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {[property.area, property.city].filter(Boolean).join(', ')}</span>}
                        </div>
                        {property.description && <p className="text-sm text-gray-700 whitespace-pre-line">{property.description}</p>}

                        {property.amenities && property.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {(property.amenities as any[]).map((a) => <Badge key={a.id} variant="outline">{a.name}</Badge>)}
                            </div>
                        )}
                    </CardContent></Card>
                </div>

                <div className="space-y-6">
                    <Card><CardContent className="p-6 grid grid-cols-2 gap-4">
                        {detail(t('Type'), property.type?.name)}
                        {detail(t('Furnishing'), property.furnishing && t(property.furnishing))}
                        {detail(t('Developer'), property.developer)}
                        {detail(t('Permit No'), property.permit_no)}
                        {detail(t('Country'), property.country)}
                        {detail(t('Agent'), property.agent?.name)}
                        {detail(t('Address'), property.address)}
                    </CardContent></Card>

                    <Card><CardContent className="p-6">
                        <h4 className="font-medium mb-3">{t('Viewings')}</h4>
                        {property.viewings && property.viewings.length > 0 ? (
                            <div className="space-y-2">
                                {property.viewings.map((v: any) => (
                                    <div key={v.id} className="flex justify-between text-sm border-b pb-2">
                                        <span>{v.scheduled_at ? formatDateTime(v.scheduled_at) : '-'}</span>
                                        <Badge variant="outline">{t(v.status.replace('_', ' '))}</Badge>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-400">{t('No viewings scheduled.')}</p>}
                    </CardContent></Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
