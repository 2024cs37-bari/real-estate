import { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/ui/input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NoRecordsFound from '@/components/no-records-found';
import { Plus, Edit, Trash2, CalendarCheck } from 'lucide-react';
import { formatDateTime } from '@/utils/helpers';

interface Option { id: number; name: string; }
interface PropOption { id: number; reference_no: string; title: string; }
interface Viewing {
    id: number; property_id: number; lead_id: number | null; user_id: number | null;
    scheduled_at: string | null; status: string; feedback: string | null;
    property?: PropOption; agent?: Option;
}
interface PageProps {
    viewings: { data: Viewing[]; current_page: number; last_page: number; per_page: number; total: number; from: number; to: number };
    properties: PropOption[]; agents: Option[]; leads: Option[]; filters: Record<string, string>;
    auth: { user?: { permissions?: string[] } }; [key: string]: any;
}

const STATUSES = ['scheduled', 'completed', 'cancelled', 'no_show'];

export default function Index() {
    const { t } = useTranslation();
    const { viewings, properties, agents, leads, filters, auth } = usePage<PageProps>().props;
    const can = (p: string) => auth.user?.permissions?.includes(p);

    const [modal, setModal] = useState<{ open: boolean; edit: Viewing | null }>({ open: false, edit: null });
    const { data, setData, post, put, processing, errors, reset } = useForm({
        property_id: '', lead_id: '', user_id: '', scheduled_at: '', status: 'scheduled', feedback: '',
    });

    const open = (edit: Viewing | null) => {
        setData({
            property_id: edit ? String(edit.property_id) : '',
            lead_id: edit?.lead_id ? String(edit.lead_id) : '',
            user_id: edit?.user_id ? String(edit.user_id) : '',
            scheduled_at: edit?.scheduled_at ? edit.scheduled_at.substring(0, 16) : '',
            status: edit?.status ?? 'scheduled',
            feedback: edit?.feedback ?? '',
        });
        setModal({ open: true, edit });
    };
    const close = () => { reset(); setModal({ open: false, edit: null }); };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const opts = { onSuccess: close };
        modal.edit
            ? put(route('real-estate.viewings.update', modal.edit.id), opts)
            : post(route('real-estate.viewings.store'), opts);
    };

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'real-estate.viewings.destroy',
        defaultMessage: t('Are you sure you want to delete this viewing?'),
    });

    const filterByStatus = (v: string) => router.get(route('real-estate.viewings.index'), { status: v === 'all' ? '' : v }, { preserveState: true, replace: true });

    const columns = [
        { key: 'property', header: t('Property'), render: (_: any, r: Viewing) => (
            <div><div className="font-medium">{r.property?.title ?? '-'}</div><div className="text-xs font-mono text-gray-500">{r.property?.reference_no}</div></div>
        ) },
        { key: 'scheduled_at', header: t('Scheduled'), render: (_: any, r: Viewing) => r.scheduled_at ? formatDateTime(r.scheduled_at) : '-' },
        { key: 'agent', header: t('Agent'), render: (_: any, r: Viewing) => r.agent?.name ?? '-' },
        { key: 'status', header: t('Status'), render: (_: any, r: Viewing) => <Badge variant="outline">{t(r.status.replace('_', ' '))}</Badge> },
        ...(can('edit-property-viewings') || can('delete-property-viewings') ? [{
            key: 'actions', header: t('Action'), render: (_: any, r: Viewing) => (
                <div className="flex gap-1"><TooltipProvider>
                    {can('edit-property-viewings') && <Tooltip delayDuration={0}><TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600" onClick={() => open(r)}><Edit className="h-4 w-4" /></Button>
                    </TooltipTrigger><TooltipContent>{t('Edit')}</TooltipContent></Tooltip>}
                    {can('delete-property-viewings') && <Tooltip delayDuration={0}><TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" onClick={() => openDeleteDialog(r.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TooltipTrigger><TooltipContent>{t('Delete')}</TooltipContent></Tooltip>}
                </TooltipProvider></div>
            )
        }] : []),
    ];

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Real Estate') }, { label: t('Viewings') }]} pageTitle={t('Property Viewings')}>
            <Head title={t('Viewings')} />
            <Card className="shadow-sm"><CardContent className="p-6">
                <div className="flex justify-between items-center gap-3 mb-6">
                    <Select value={filters.status || 'all'} onValueChange={filterByStatus}>
                        <SelectTrigger className="w-40"><SelectValue placeholder={t('Status')} /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('All')}</SelectItem>
                            {STATUSES.map((s) => <SelectItem key={s} value={s}>{t(s.replace('_', ' '))}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {can('create-property-viewings') && <Button onClick={() => open(null)}><Plus className="h-4 w-4 mr-1" /> {t('Schedule Viewing')}</Button>}
                </div>

                <div className="overflow-x-auto"><div className="min-w-[700px]">
                    <DataTable data={viewings?.data || []} columns={columns}
                        emptyState={<NoRecordsFound icon={CalendarCheck} title={t('No viewings found')} description={t('Schedule your first property viewing.')} createPermission="create-property-viewings" onCreateClick={() => open(null)} createButtonText={t('Schedule Viewing')} className="h-auto" />} />
                </div></div>

                {viewings?.data?.length > 0 && <div className="mt-4"><Pagination data={viewings} routeName="real-estate.viewings.index" filters={filters} /></div>}
            </CardContent></Card>

            <Dialog open={modal.open} onOpenChange={(o) => !o && close()}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{modal.edit ? t('Edit Viewing') : t('Schedule Viewing')}</DialogTitle></DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label>{t('Property')} *</Label>
                            <Select value={data.property_id} onValueChange={(v) => setData('property_id', v)}>
                                <SelectTrigger><SelectValue placeholder={t('Select property')} /></SelectTrigger>
                                <SelectContent>
                                    {properties.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.reference_no} - {p.title}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.property_id} />
                        </div>
                        <div>
                            <Label>{t('Agent')}</Label>
                            <Select value={data.user_id} onValueChange={(v) => setData('user_id', v)}>
                                <SelectTrigger><SelectValue placeholder={t('Select agent')} /></SelectTrigger>
                                <SelectContent>{agents.map((a) => <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        {leads.length > 0 && (
                            <div>
                                <Label>{t('Lead (optional)')}</Label>
                                <Select value={data.lead_id} onValueChange={(v) => setData('lead_id', v)}>
                                    <SelectTrigger><SelectValue placeholder={t('Link a lead')} /></SelectTrigger>
                                    <SelectContent>{leads.map((l) => <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        )}
                        <div>
                            <Label htmlFor="scheduled_at">{t('Scheduled At')} *</Label>
                            <Input id="scheduled_at" type="datetime-local" value={data.scheduled_at} onChange={(e) => setData('scheduled_at', e.target.value)} required />
                            <InputError message={errors.scheduled_at} />
                        </div>
                        <div>
                            <Label>{t('Status')} *</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{t(s.replace('_', ' '))}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="feedback">{t('Feedback')}</Label>
                            <Textarea id="feedback" value={data.feedback} onChange={(e) => setData('feedback', e.target.value)} rows={3} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={close}>{t('Cancel')}</Button>
                            <Button type="submit" disabled={processing}>{modal.edit ? t('Update') : t('Schedule')}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog open={deleteState.isOpen} onOpenChange={closeDeleteDialog} title={t('Delete Viewing')} message={deleteState.message} confirmText={t('Delete')} onConfirm={confirmDelete} variant="destructive" />
        </AuthenticatedLayout>
    );
}
