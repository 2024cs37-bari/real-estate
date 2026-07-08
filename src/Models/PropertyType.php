<?php

namespace Zerp\RealEstate\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PropertyType extends Model
{
    protected $fillable = ['name', 'icon', 'created_by'];

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }
}
