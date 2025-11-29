<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clubs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('club_name');
            $table->string('club_code')->unique();
            $table->string('club_email')->unique();
            $table->string('faculty_incharge');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clubs');
    }
};
