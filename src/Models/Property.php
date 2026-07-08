<?php

namespace Zerp\RealEstate\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_no', 'title', 'property_type_id', 'purpose', 'status',
        'price', 'currency', 'country', 'city', 'area', 'address',
        'bedrooms', 'bathrooms', 'size', 'size_unit', 'furnishing',
        'developer', 'permit_no', 'description', 'user_id',
        'is_active', 'is_featured', 'creator_id', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'size' => 'decimal:2',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(PropertyType::class, 'property_type_id');
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class, 'property_amenity');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    public function viewings(): HasMany
    {
        return $this->hasMany(PropertyViewing::class);
    }

    /**
     * Next reference number, e.g. PR-0001. Scoped per company (created_by).
     */
    public static function nextReferenceNo(?int $companyId): string
    {
        $count = static::where('created_by', $companyId)->count() + 1;
        return 'PR-' . str_pad((string) $count, 4, '0', STR_PAD_LEFT);
    }
}
