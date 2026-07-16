# Zerp Real Estate

A real estate brokerage module for [Zerp](https://github.com/zerp-pk) - a Laravel package with a React/Inertia frontend, following the same structure as every other `zerp/*` module.

It adds property/listing management and viewings on top of Zerp's existing CRM, so a brokerage can run its inventory, assign listings to agents, and track viewings in one place.

## Features

- **Property database** - listings with type, purpose (sale/rent), status (available/reserved/sold/rented/off-plan), price, images, amenities, and location. Configurable currency and size unit (sqft / sqm / marla / kanal) so it fits any local market.
- **Property viewings** - schedule and track viewings against a listing and (optionally) a CRM lead, with status and feedback.
- **System setup** - manage property types and amenities.
- **Dashboard** - inventory counts by status and type, plus upcoming viewings.
- **Role-based permissions** and per-agent assignment throughout.

## Installation

The module is consumed by the main Zerp app as a Composer path package. In the app's `composer.json`, add a path repository and require it:

```json
{
  "repositories": [
    { "type": "path", "url": "../ZerpPackages/real-estate", "options": { "symlink": true } }
  ],
  "require": { "zerp/real-estate": "@dev" }
}
```

Then:

```bash
composer update zerp/real-estate
php artisan migrate
php artisan package:seed RealEstate
```

Or enable it as part of the **Real Estate Brokerage** install preset:

```bash
php artisan app:install --preset=real-estate
```

## License

MIT - see [LICENSE](LICENSE).
