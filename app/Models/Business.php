<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    protected $fillable = ['name','campaign_end_date'];

    public function admins(){
        return $this->hasMany(User::class);
    }

    public function branches(){
        return $this->hasMany(BusinessBranch::class);
    }

    public function promotions(){
        return $this->hasMany(BusinessPromotion::class);
    }

}
