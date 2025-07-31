<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
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
            'title' => $this->title,
            'body' => $this->body,
            'image' => $this->image ? url('storage/notification_images/' . $this->image) : null,
            'created_at' => $this->created_at->diffForHumans(),
            'is_read' => $this->user_notifications[0]->is_read,
        ];

    }
}
