<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('property_viewings')) {
            Schema::create('property_viewings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('property_id')->index();
                // Soft link to the CRM lead module - nullable, and the FK is only
                // added when the leads table exists so viewings work standalone.
                // ponytail: decoupled from the lead package, no edits to it.
                $table->foreignId('lead_id')->nullable()->index();
                $table->foreignId('user_id')->nullable()->index(); // agent
                $table->dateTime('scheduled_at')->nullable();
                $table->enum('status', ['scheduled', 'completed', 'cancelled', 'no_show'])->default('scheduled');
                $table->text('feedback')->nullable();
                $table->foreignId('creator_id')->nullable()->index();
                $table->foreignId('created_by')->nullable()->index();
                $table->timestamps();

                $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
                $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');

                if (Schema::hasTable('leads')) {
                    $table->foreign('lead_id')->references('id')->on('leads')->onDelete('set null');
                }
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('property_viewings');
    }
};
