<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['title', 'body', 'image','business_id'];

    public function user_notifications(){
        return $this->hasMany(UserNotification::class);
    }

    public function business(){
        return $this->belongsTo(Business::class);
    }

}
