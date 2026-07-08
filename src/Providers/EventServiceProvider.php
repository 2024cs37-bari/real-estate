<?php

namespace Zerp\RealEstate\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        // Phase 2 hook point: portal-publish / lead-webhook listeners go here.
    ];
}
