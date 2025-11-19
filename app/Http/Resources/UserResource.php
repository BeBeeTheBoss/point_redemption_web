<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data =  parent::toArray($request);

        $business = $this->business ? $this->business : $this->branch?->business;

        $data['business_id'] = $business?->id;
        $data['business_name'] = $business?->name;
        $data['branch_name'] = $this->branch?->name;
        $data['campaign_start_date'] = $business?->campaign_start_date;
        $data['campaign_end_date'] = $business?->campaign_end_date;

        return $data;
    }
}
