<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessPromotion extends Model
{
    protected $fillable = ['business_id','promotion_code'];

    public function business(){
        return $this->belongsTo(Business::class, 'business_id');
    }

}
