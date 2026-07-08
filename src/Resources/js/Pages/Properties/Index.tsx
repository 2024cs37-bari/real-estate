import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NoRecordsFound from '@/components/no-records-found';
import { Plus, Edit, Trash2, Eye, Building2 } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import { Option, Property, PURPOSES, STATUSES } from './types';

interface PageProps {
    properties: { data: Property[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number };
    types: Option[];
    filters: Record<string, string>;
    auth: { user?: { permissions?: string[] } };
    [key: string]: any;
}

const statusColor: Record<string, string> = {
    available: 'bg-green-100 text-green-700',
    reserved: 'bg-yellow-100 text-yellow-700',
    sold: 'bg-gray-200 text-gray-700',
    rented: 'bg-gray-200 text-gray-700',
    off_plan: 'bg-blue-100 text-blue-700',
};

export default function Index() {
    const { t } = useTranslation();
    const { properties, types, filters, auth } = usePage<PageProps>().props;
    const can = (p: string) => auth.user?.permissions?.includes(p);

    const [local, setLocal] = useState({
        search: filters.search ?? '', property_type_id: filters.property_type_id ?? '',
        purpose: filters.purpose ?? '', status: filters.status ?? '',
    });

    const applyFilters = (next: typeof local) => {
        setLocal(next);
        router.get(route('real-estate.properties.index'), next, { preserveState: true, replace: true });
    };

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'real-estate.properties.destroy',
        defaultMessage: t('Are you sure you want to delete this property?'),
    });

    const columns = [
        { key: 'reference_no', header: t('Ref'), render: (_: any, p: Property) => <span className="font-mono text-xs">{p.reference_no}</span> },
        { key: 'title', header: t('Title'), render: (_: any, p: Property) => (
            <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-gray-500">{[p.area, p.city].filter(Boolean).join(', ')}</div>
            </div>
        ) },
        { key: 'type', header: t('Type'), render: (_: any, p: Property) => p.type?.name ?? '-' },
        { key: 'purpose', header: t('Purpose'), render: (_: any, p: Property) => t(p.purpose) },
        { key: 'status', header: t('Status'), render: (_: any, p: Property) => (
            <Badge className={statusColor[p.status] ?? ''}>{t(p.status.replace('_', ' '))}</Badge>
        ) },
        { key: 'price', header: t('Price'), render: (_: any, p: Property) => (
            <span>{p.currency ? `${p.currency} ` : ''}{formatCurrency(p.price)}</span>
        ) },
        { key: 'actions', header: t('Action'), render: (_: any, p: Property) => (
            <div className="flex gap-1">
                <TooltipProvider>
                    <Tooltip delayDuration={0}><TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => router.get(route('real-estate.properties.show', p.id))}><Eye className="h-4 w-4" /></Button>
                    </TooltipTrigger><TooltipContent>{t('View')}</TooltipContent></Tooltip>
                    {can('edit-properties') && (
                        <Tooltip delayDuration={0}><TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600" onClick={() => router.get(route('real-estate.properties.edit', p.id))}><Edit className="h-4 w-4" /></Button>
                        </TooltipTrigger><TooltipContent>{t('Edit')}</TooltipContent></Tooltip>
                    )}
                    {can('delete-properties') && (
                        <Tooltip delayDuration={0}><TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" onClick={() => openDeleteDialog(p.id)}><Trash2 className="h-4 w-4" /></Button>
                        </TooltipTrigger><TooltipContent>{t('Delete')}</TooltipContent></Tooltip>
                    )}
                </TooltipProvider>
            </div>
        ) },
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Real Estate') }, { label: t('Properties') }]}
            pageTitle={t('Properties')}
        >
            <Head title={t('Properties')} />
            <Card className="shadow-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                        <div className="flex flex-wrap gap-2">
                            <Input className="w-48" placeholder={t('Search title / ref')} value={local.search}
                                onChange={(e) => setLocal({ ...local, search: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters(local)} />
                            <Select value={local.property_type_id || 'all'} onValueChange={(v) => applyFilters({ ...local, property_type_id: v === 'all' ? '' : v })}>
                                <SelectTrigger className="w-40"><SelectValue placeholder={t('Type')} /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('All Types')}</SelectItem>
                                    {types.map((ty) => <SelectItem key={ty.id} value={String(ty.id)}>{ty.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={local.purpose || 'all'} onValueChange={(v) => applyFilters({ ...local, purpose: v === 'all' ? '' : v })}>
                                <SelectTrigger className="w-32"><SelectValue placeholder={t('Purpose')} /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('All')}</SelectItem>
                                    {PURPOSES.map((o) => <SelectItem key={o} value={o}>{t(o)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={local.status || 'all'} onValueChange={(v) => applyFilters({ ...local, status: v === 'all' ? '' : v })}>
                                <SelectTrigger className="w-36"><SelectValue placeholder={t('Status')} /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('All')}</SelectItem>
                                    {STATUSES.map((o) => <SelectItem key={o} value={o}>{t(o.replace('_', ' '))}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        {can('create-properties') && (
                            <Button onClick={() => router.get(route('real-estate.properties.create'))}>
                                <Plus className="h-4 w-4 mr-1" /> {t('Add Property')}
                            </Button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <div className="min-w-[800px]">
                            <DataTable
                                data={properties?.data || []}
                                columns={columns}
                                emptyState={
                                    <NoRecordsFound
                                        icon={Building2}
                                        title={t('No properties found')}
                                        description={t('Get started by adding your first property.')}
                                        createPermission="create-properties"
                                        onCreateClick={() => router.get(route('real-estate.properties.create'))}
                                        createButtonText={t('Add Property')}
                                        className="h-auto"
                                    />
                                }
                            />
                        </div>
                    </div>

                    {properties?.data?.length > 0 && (
                        <div className="mt-4">
                            <Pagination data={properties} routeName="real-estate.properties.index" filters={local} />
                        </div>
                    )}
                </CardContent>
            </Card>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Property')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
