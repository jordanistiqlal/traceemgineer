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
        Schema::table('track_logs', function (Blueprint $table) {
            $table->foreignUuid('user_id')->nullable()->references('user_id')->on('users')->nullOnDelete();
            $table->foreignUuid('project_id')->nullable()->references('project_id')->on('projects')->nullOnDelete();
            $table->foreignUuid('ticket_id')->nullable()->references('ticket_id')->on('tickets')->nullOnDelete();
            $table->foreignUuid('task_id')->nullable()->references('task_id')->on('tasks')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('track_logs', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['project_id']);
            $table->dropForeign(['ticket_id']);
            $table->dropForeign(['task_id']);
        });

    }
};
