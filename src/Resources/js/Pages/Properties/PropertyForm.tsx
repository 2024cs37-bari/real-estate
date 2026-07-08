import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import InputError from '@/components/ui/input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MediaPicker from '@/components/MediaPicker';
import { Option, PropertyFormData, PURPOSES, STATUSES, SIZE_UNITS, FURNISHINGS } from './types';

interface Props {
    data: PropertyFormData;
    setData: (key: string, value: any) => void;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    types: Option[];
    amenities: Option[];
    agents: Option[];
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
    onCancel: () => void;
}

export default function PropertyForm({ data, setData, errors, processing, types, amenities, agents, onSubmit, submitLabel, onCancel }: Props) {
    const { t } = useTranslation();

    const toggleAmenity = (id: number) => {
        const set = new Set(data.amenities);
        set.has(id) ? set.delete(id) : set.add(id);
        setData('amenities', Array.from(set));
    };

    const enumSelect = (field: string, options: string[], placeholder: string) => (
        <Select value={data[field] || ''} onValueChange={(v) => setData(field, v)}>
            <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
            <SelectContent>
                {options.map((o) => <SelectItem key={o} value={o}>{t(o.replace('_', ' '))}</SelectItem>)}
            </SelectContent>
        </Select>
    );

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <Label htmlFor="title">{t('Title')} *</Label>
                    <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                    <InputError message={errors.title} />
                </div>

                <div>
                    <Label>{t('Property Type')}</Label>
                    <Select value={data.property_type_id || ''} onValueChange={(v) => setData('property_type_id', v)}>
                        <SelectTrigger><SelectValue placeholder={t('Select type')} /></SelectTrigger>
                        <SelectContent>
                            {types.map((ty) => <SelectItem key={ty.id} value={String(ty.id)}>{ty.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.property_type_id} />
                </div>

                <div>
                    <Label>{t('Assigned Agent')}</Label>
                    <Select value={data.user_id || ''} onValueChange={(v) => setData('user_id', v)}>
                        <SelectTrigger><SelectValue placeholder={t('Select agent')} /></SelectTrigger>
                        <SelectContent>
                            {agents.map((a) => <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>{t('Purpose')} *</Label>
                    {enumSelect('purpose', PURPOSES, t('Select purpose'))}
                    <InputError message={errors.purpose} />
                </div>

                <div>
                    <Label>{t('Status')} *</Label>
                    {enumSelect('status', STATUSES, t('Select status'))}
                    <InputError message={errors.status} />
                </div>

                <div>
                    <Label htmlFor="price">{t('Price')} *</Label>
                    <Input id="price" type="number" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} required />
                    <InputError message={errors.price} />
                </div>

                <div>
                    <Label htmlFor="currency">{t('Currency')}</Label>
                    <Input id="currency" value={data.currency} onChange={(e) => setData('currency', e.target.value)} placeholder="PKR / AED / USD" />
                    <InputError message={errors.currency} />
                </div>

                <div>
                    <Label htmlFor="bedrooms">{t('Bedrooms')}</Label>
                    <Input id="bedrooms" type="number" min="0" value={data.bedrooms} onChange={(e) => setData('bedrooms', e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="bathrooms">{t('Bathrooms')}</Label>
                    <Input id="bathrooms" type="number" min="0" value={data.bathrooms} onChange={(e) => setData('bathrooms', e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="size">{t('Size')}</Label>
                    <Input id="size" type="number" step="0.01" value={data.size} onChange={(e) => setData('size', e.target.value)} />
                </div>

                <div>
                    <Label>{t('Size Unit')}</Label>
                    {enumSelect('size_unit', SIZE_UNITS, t('Select unit'))}
                </div>

                <div>
                    <Label>{t('Furnishing')}</Label>
                    {enumSelect('furnishing', FURNISHINGS, t('Select furnishing'))}
                </div>

                <div>
                    <Label htmlFor="developer">{t('Developer / Project')}</Label>
                    <Input id="developer" value={data.developer} onChange={(e) => setData('developer', e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="permit_no">{t('Permit / RERA No')}</Label>
                    <Input id="permit_no" value={data.permit_no} onChange={(e) => setData('permit_no', e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="country">{t('Country')}</Label>
                    <Input id="country" value={data.country} onChange={(e) => setData('country', e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="city">{t('City')}</Label>
                    <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="area">{t('Area / Community')}</Label>
                    <Input id="area" value={data.area} onChange={(e) => setData('area', e.target.value)} />
                </div>

                <div className="md:col-span-2">
                    <Label htmlFor="address">{t('Address')}</Label>
                    <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                </div>

                <div className="md:col-span-2">
                    <Label htmlFor="description">{t('Description')}</Label>
                    <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} />
                </div>
            </div>

            <div>
                <Label className="mb-2 block">{t('Amenities')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {amenities.map((am) => (
                        <label key={am.id} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.amenities.includes(am.id)}
                                onChange={() => toggleAmenity(am.id)}
                                className="rounded border-gray-300"
                            />
                            {am.name}
                        </label>
                    ))}
                    {amenities.length === 0 && <span className="text-sm text-gray-400">{t('No amenities configured yet.')}</span>}
                </div>
            </div>

            <div>
                <Label className="mb-2 block">{t('Images')}</Label>
                <MediaPicker
                    value={data.images}
                    onChange={(v) => setData('images', Array.isArray(v) ? v : [v].filter(Boolean))}
                    multiple
                    placeholder={t('Select images')}
                    showPreview
                    label=""
                />
            </div>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <Switch id="is_active" checked={data.is_active} onCheckedChange={(v) => setData('is_active', v)} />
                    <Label htmlFor="is_active">{t('Active')}</Label>
                </div>
                <div className="flex items-center gap-2">
                    <Switch id="is_featured" checked={data.is_featured} onCheckedChange={(v) => setData('is_featured', v)} />
                    <Label htmlFor="is_featured">{t('Featured')}</Label>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>{t('Cancel')}</Button>
                <Button type="submit" disabled={processing}>{processing ? t('Saving...') : submitLabel}</Button>
            </div>
        </form>
    );
}
