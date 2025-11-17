<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('track_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('track_log_id', 32)->unique();
            $table->string('user_id');
            $table->string('type', 64);
            $table->string('project_id');
            $table->string('latitude', 32)->nullable();
            $table->string('longitude', 32)->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('track_logs');
    }
};
