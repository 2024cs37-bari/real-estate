import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent } from '@/components/ui/card';
import PropertyForm from './PropertyForm';
import { Option, PropertyFormData } from './types';

interface PageProps {
    types: Option[];
    amenities: Option[];
    agents: Option[];
    [key: string]: any;
}

export default function Create() {
    const { t } = useTranslation();
    const { types, amenities, agents } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm<PropertyFormData>({
        title: '', property_type_id: '', purpose: 'sale', status: 'available',
        price: '', currency: '', country: '', city: '', area: '', address: '',
        bedrooms: '', bathrooms: '', size: '', size_unit: 'sqft', furnishing: '',
        developer: '', permit_no: '', description: '', user_id: '',
        is_active: true, is_featured: false, amenities: [], images: [],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('real-estate.properties.store'));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Real Estate'), url: route('real-estate.properties.index') },
                { label: t('Properties'), url: route('real-estate.properties.index') },
                { label: t('Create') },
            ]}
            pageTitle={t('Create Property')}
        >
            <Head title={t('Create Property')} />
            <Card className="shadow-sm">
                <CardContent className="p-6">
                    <PropertyForm
                        data={data} setData={setData} errors={errors} processing={processing}
                        types={types} amenities={amenities} agents={agents}
                        onSubmit={submit} submitLabel={t('Create')}
                        onCancel={() => router.get(route('real-estate.properties.index'))}
                    />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
