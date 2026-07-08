export interface Option {
    id: number;
    name: string;
}

export interface PropertyImage {
    id: number;
    file_name: string | null;
    file_path: string | null;
    media_id: number | null;
    sort_order: number;
}

export interface Property {
    id: number;
    reference_no: string;
    title: string;
    property_type_id: number | null;
    type?: Option | null;
    purpose: 'sale' | 'rent';
    status: 'available' | 'reserved' | 'sold' | 'rented' | 'off_plan';
    price: number | string;
    currency: string | null;
    country: string | null;
    city: string | null;
    area: string | null;
    address: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    size: number | string | null;
    size_unit: string;
    furnishing: 'furnished' | 'semi' | 'unfurnished' | null;
    developer: string | null;
    permit_no: string | null;
    description: string | null;
    user_id: number | null;
    agent?: Option | null;
    is_active: boolean;
    is_featured: boolean;
    amenities?: { id: number }[] | Option[];
    images?: PropertyImage[];
    viewings?: any[];
    created_at?: string;
}

export interface PropertyFormData {
    title: string;
    property_type_id: string;
    purpose: string;
    status: string;
    price: string;
    currency: string;
    country: string;
    city: string;
    area: string;
    address: string;
    bedrooms: string;
    bathrooms: string;
    size: string;
    size_unit: string;
    furnishing: string;
    developer: string;
    permit_no: string;
    description: string;
    user_id: string;
    is_active: boolean;
    is_featured: boolean;
    amenities: number[];
    images: string[];
    [key: string]: any;
}

export const PURPOSES = ['sale', 'rent'];
export const STATUSES = ['available', 'reserved', 'sold', 'rented', 'off_plan'];
export const SIZE_UNITS = ['sqft', 'sqm', 'marla', 'kanal'];
export const FURNISHINGS = ['furnished', 'semi', 'unfurnished'];
