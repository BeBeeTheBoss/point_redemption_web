<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoginDevice extends Model
{
    protected $fillable = ['user_id','push_noti_token', 'device_id', 'device_name'];
}
