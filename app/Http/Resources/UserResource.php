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

        $data['business_name'] = $this->business->name;
        $data['campaign_end_date'] = $this->business->campaign_end_date;

        return $data;
    }
}
