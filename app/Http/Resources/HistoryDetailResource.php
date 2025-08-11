<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HistoryDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'member_idcard' => $this->member_idcard,
            'member_name' => $this->member_name,
            'promotion_code' => $this->promotion_code,
            'promotion_name' => $this->promotion_name,
            'qty' => $this->qty,
            'redeemed_points' => $this->redeemed_points,
            'redeemed_date' => $this->redeemed_date,
            'created_at' => $this->created_at,
            'business_id' => $this->business_id,
            'business_name' => $this->business->name,
            'branch_id' => $this->branch_id,
            'branch_name' => $this->branch->name
        ];
    }
}
