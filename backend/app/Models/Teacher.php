<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'teacher_id',
        'department',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
