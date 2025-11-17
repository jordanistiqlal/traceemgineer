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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->uuid('project_id', 32)->unique();
            $table->string('project_name', 128)->nullable();
            $table->string('project_type', 64)->nullable();
            $table->string('user_id', 32);
            $table->string('task_id', 32);
            $table->string('ticket_id', 32);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
