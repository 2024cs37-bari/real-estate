import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/ui/input-error';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NoRecordsFound from '@/components/no-records-found';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import SystemSetupSidebar from '../SystemSetupSidebar';

interface Amenity { id: number; name: string; }
interface PageProps { amenities: Amenity[]; auth: { user?: { permissions?: string[] } }; [key: string]: any; }

export default function Index() {
    const { t } = useTranslation();
    const { amenities, auth } = usePage<PageProps>().props;
    const can = (p: string) => auth.user?.permissions?.includes(p);

    const [modal, setModal] = useState<{ open: boolean; edit: Amenity | null }>({ open: false, edit: null });
    const { data, setData, post, put, processing, errors, reset } = useForm({ name: '' });

    const open = (edit: Amenity | null) => { setData({ name: edit?.name ?? '' }); setModal({ open: true, edit }); };
    const close = () => { reset(); setModal({ open: false, edit: null }); };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const opts = { onSuccess: close };
        modal.edit
            ? put(route('real-estate.amenities.update', modal.edit.id), opts)
            : post(route('real-estate.amenities.store'), opts);
    };

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'real-estate.amenities.destroy',
        defaultMessage: t('Are you sure you want to delete this amenity?'),
    });

    const columns = [
        { key: 'name', header: t('Name') },
        ...(can('edit-amenities') || can('delete-amenities') ? [{
            key: 'actions', header: t('Action'), render: (_: any, row: Amenity) => (
                <div className="flex gap-1"><TooltipProvider>
                    {can('edit-amenities') && <Tooltip delayDuration={0}><TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600" onClick={() => open(row)}><Edit className="h-4 w-4" /></Button>
                    </TooltipTrigger><TooltipContent>{t('Edit')}</TooltipContent></Tooltip>}
                    {can('delete-amenities') && <Tooltip delayDuration={0}><TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" onClick={() => openDeleteDialog(row.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TooltipTrigger><TooltipContent>{t('Delete')}</TooltipContent></Tooltip>}
                </TooltipProvider></div>
            )
        }] : []),
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Real Estate'), url: route('real-estate.properties.index') }, { label: t('System Setup') }, { label: t('Amenities') }]}
            pageTitle={t('System Setup')}
        >
            <Head title={t('Amenities')} />
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-64 flex-shrink-0"><SystemSetupSidebar activeItem="amenities" /></div>
                <div className="flex-1">
                    <Card className="shadow-sm"><CardContent className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium">{t('Amenities')}</h3>
                            {can('create-amenities') && <Button size="sm" onClick={() => open(null)}><Plus className="h-4 w-4" /></Button>}
                        </div>
                        <DataTable data={amenities} columns={columns}
                            emptyState={<NoRecordsFound icon={Star} title={t('No amenities found')} description={t('Create your first amenity.')} createPermission="create-amenities" onCreateClick={() => open(null)} createButtonText={t('Create Amenity')} className="h-auto" />} />
                    </CardContent></Card>
                </div>
            </div>

            <Dialog open={modal.open} onOpenChange={(o) => !o && close()}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{modal.edit ? t('Edit Amenity') : t('Create Amenity')}</DialogTitle></DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">{t('Name')}</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            <InputError message={errors.name} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={close}>{t('Cancel')}</Button>
                            <Button type="submit" disabled={processing}>{modal.edit ? t('Update') : t('Create')}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog open={deleteState.isOpen} onOpenChange={closeDeleteDialog} title={t('Delete Amenity')} message={deleteState.message} confirmText={t('Delete')} onConfirm={confirmDelete} variant="destructive" />
        </AuthenticatedLayout>
    );
}
