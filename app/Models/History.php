<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    protected $fillable = ['business_id', 'member_idcard', 'member_name', 'promotion_code', 'promotion_name', 'qty', 'redeemed_points', 'redeemed_date','branch_id'];

    public function business()
    {
        return $this->belongsTo(Business::class, 'business_id');
    }

    public function branch()
    {
        return $this->belongsTo(BusinessBranch::class, 'branch_id');
    }

}
