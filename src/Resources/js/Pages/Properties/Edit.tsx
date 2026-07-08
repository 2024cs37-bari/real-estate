import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent } from '@/components/ui/card';
import PropertyForm from './PropertyForm';
import { Option, Property, PropertyFormData } from './types';

interface PageProps {
    property: Property;
    types: Option[];
    amenities: Option[];
    agents: Option[];
    [key: string]: any;
}

export default function Edit() {
    const { t } = useTranslation();
    const { property, types, amenities, agents } = usePage<PageProps>().props;

    const { data, setData, put, processing, errors } = useForm<PropertyFormData>({
        title: property.title ?? '',
        property_type_id: property.property_type_id ? String(property.property_type_id) : '',
        purpose: property.purpose ?? 'sale',
        status: property.status ?? 'available',
        price: property.price != null ? String(property.price) : '',
        currency: property.currency ?? '',
        country: property.country ?? '',
        city: property.city ?? '',
        area: property.area ?? '',
        address: property.address ?? '',
        bedrooms: property.bedrooms != null ? String(property.bedrooms) : '',
        bathrooms: property.bathrooms != null ? String(property.bathrooms) : '',
        size: property.size != null ? String(property.size) : '',
        size_unit: property.size_unit ?? 'sqft',
        furnishing: property.furnishing ?? '',
        developer: property.developer ?? '',
        permit_no: property.permit_no ?? '',
        description: property.description ?? '',
        user_id: property.user_id ? String(property.user_id) : '',
        is_active: !!property.is_active,
        is_featured: !!property.is_featured,
        amenities: (property.amenities ?? []).map((a: any) => a.id),
        images: (property.images ?? []).map((img: any) => img.file_path).filter(Boolean),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('real-estate.properties.update', property.id));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Real Estate'), url: route('real-estate.properties.index') },
                { label: t('Properties'), url: route('real-estate.properties.index') },
                { label: property.reference_no },
            ]}
            pageTitle={t('Edit Property')}
        >
            <Head title={t('Edit Property')} />
            <Card className="shadow-sm">
                <CardContent className="p-6">
                    <PropertyForm
                        data={data} setData={setData} errors={errors} processing={processing}
                        types={types} amenities={amenities} agents={agents}
                        onSubmit={submit} submitLabel={t('Update')}
                        onCancel={() => router.get(route('real-estate.properties.index'))}
                    />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
