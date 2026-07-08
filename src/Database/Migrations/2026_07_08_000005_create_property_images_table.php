<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('property_images')) {
            Schema::create('property_images', function (Blueprint $table) {
                $table->id();
                $table->foreignId('property_id')->index();
                $table->string('file_name')->nullable();
                $table->string('file_path')->nullable();
                $table->foreignId('media_id')->nullable()->constrained('media')->nullOnDelete();
                $table->integer('sort_order')->default(0);
                $table->timestamps();

                $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('property_images');
    }
};
