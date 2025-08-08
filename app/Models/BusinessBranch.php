<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessBranch extends Model
{
    protected $fillable = ['name','address','business_id'];


    public function users(){
        return $this->hasMany(User::class, 'branch_id');
    }

}
