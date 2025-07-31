<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    protected $fillable = ['name','campaign_end_date'];

    public function users(){
        return $this->hasMany(User::class);
    }

}
