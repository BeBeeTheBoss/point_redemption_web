<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessBranch extends Model
{
    protected $fillable = ['name','address','business_id'];


    public function business(){
        return $this->belongsTo(Business::class);
    }

    public function users(){
        return $this->hasMany(User::class, 'branch_id');
    }

}
