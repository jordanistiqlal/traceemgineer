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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->uuid('ticket_id', 32)->unique();
            $table->string('ticket_site', 128);
            $table->text('ticket_problem')->nullable();
            $table->string('ticket_jam', 16)->nullable();
            $table->string('ticket_from', 32)->nullable();
            $table->text('bodyraw');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
