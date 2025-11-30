<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'club_name',
        'club_code',
        'club_email',
        'faculty_incharge',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
