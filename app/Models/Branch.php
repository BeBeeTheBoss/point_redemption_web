<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = [
        'branch_name',
        'branch_code',
        'branch_short_name',
        'erp_branch_id'
    ];
}
