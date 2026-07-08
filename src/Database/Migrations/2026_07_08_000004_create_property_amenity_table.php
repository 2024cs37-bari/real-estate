<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('property_amenity')) {
            Schema::create('property_amenity', function (Blueprint $table) {
                $table->id();
                $table->foreignId('property_id')->index();
                $table->foreignId('amenity_id')->index();
                $table->timestamps();

                $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
                $table->foreign('amenity_id')->references('id')->on('amenities')->onDelete('cascade');
                $table->unique(['property_id', 'amenity_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('property_amenity');
    }
};
