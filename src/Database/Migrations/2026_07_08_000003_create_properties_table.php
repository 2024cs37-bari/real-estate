<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('properties')) {
            Schema::create('properties', function (Blueprint $table) {
                $table->id();
                $table->string('reference_no')->unique();
                $table->string('title');
                $table->foreignId('property_type_id')->nullable()->index();
                $table->enum('purpose', ['sale', 'rent'])->default('sale');
                $table->enum('status', ['available', 'reserved', 'sold', 'rented', 'off_plan'])->default('available');
                $table->decimal('price', 15, 2)->default(0);
                $table->string('currency', 8)->nullable();
                $table->string('country')->nullable();
                $table->string('city')->nullable();
                $table->string('area')->nullable();
                $table->string('address')->nullable();
                $table->integer('bedrooms')->nullable();
                $table->integer('bathrooms')->nullable();
                $table->decimal('size', 12, 2)->nullable();
                $table->string('size_unit', 12)->default('sqft'); // sqft | sqm | marla | kanal
                $table->enum('furnishing', ['furnished', 'semi', 'unfurnished'])->nullable();
                $table->string('developer')->nullable();
                $table->string('permit_no')->nullable(); // e.g. UAE RERA / local permit
                $table->longText('description')->nullable();
                $table->foreignId('user_id')->nullable()->index(); // assigned agent
                $table->boolean('is_active')->default(true);
                $table->boolean('is_featured')->default(false);
                $table->foreignId('creator_id')->nullable()->index();
                $table->foreignId('created_by')->nullable()->index();
                $table->timestamps();

                $table->foreign('property_type_id')->references('id')->on('property_types')->onDelete('set null');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
                $table->foreign('creator_id')->references('id')->on('users')->onDelete('set null');
                $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
