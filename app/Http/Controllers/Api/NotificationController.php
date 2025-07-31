<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\UserNotification;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\NotificationResource;

class NotificationController extends Controller
{
    public function __construct(protected Notification $model)
    {
    }

    public function index(Request $request, $id = null)
    {
        info($id);
        info($request->user_id);

        $data = $this->model->when($id, function ($query) use ($id) {
            $query->where('id', $id);
        })->when($request->user_id, function ($query) use ($request) {
            $query->whereHas('user_notifications', function ($query) use ($request) {
                $query->where('user_id', $request->user_id);
            });
        })->with('user_notifications', function ($query) use ($request) {
            $query->where('user_id', $request->user_id);
        })->orderBy('created_at', 'desc')->get();

        return sendResponse(NotificationResource::collection($data), 200);
    }

    public function store(Request $request)
    {

        $request->validate([
            'title' => 'required',
            'to' => 'required',
        ]);

        DB::beginTransaction();
        try {
            $notification = $this->model->create($this->changeToArray($request->all()));

            $this->setNotificationToUser($notification, $request->to);

            if ($request->file('image')) {

                $image = $request->file('image');
                $imageName = uniqid() . '_' . time() . '.' . $image->getClientOriginalExtension();
                $image->storeAs('notification_images', $imageName, 'public');
                $notification->image = $imageName;
                $notification->save();
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            return sendResponse(null, 400, $e->getMessage());
        }

        if ($notification->image)
            $notification->image = url('storage/notification_images/' . $notification->image);

        return sendResponse($notification, 200, "Notification created successfully");
    }

    public function update(Request $request)
    {

        $request->validate([
            'id' => 'required',
            'title' => 'required',
            'to' => 'required',
        ]);

        $notification = $this->model->find($request->id);
        if (!$notification) {
            return sendResponse(null, 400, "Notification not found");
        }

        $notification->update($this->changeToArray($request->all()));

        UserNotification::where('notification_id', $notification->id)->delete();

        $this->setNotificationToUser($notification, $request->to);

        if ($request->deleteImage) {
            Storage::delete('public' . '/notification_images/' . $notification->image);
            $notification->image = null;
            $notification->save();
        }

        if ($request->file('image')) {

            $image = $request->file('image');
            $imageName = uniqid() . '_' . time() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('notification_images', $imageName, 'public');
            $notification->image = $imageName;
            $notification->save();
        }

        if ($notification->image)
            $notification->image = url('storage/notification_images/' . $notification->image);

        return sendResponse($notification, 200, "Notification updated successfully");
    }

    public function destroy(Request $request)
    {
        $notification = $this->model->find($request->id);
        if (!$notification) {
            return sendResponse(null, 400, "Notification not found");
        }

        Storage::delete('public' . '/notification_images/' . $notification->image);
        UserNotification::where('notification_id', $notification->id)->delete();
        $notification->delete();
        return sendResponse(null, 200, "Notification deleted successfully");
    }

    public function markAsRead(Request $request)
    {
        $notification = $this->model->find($request->id);
        if (!$notification) {
            return sendResponse(null, 400, "Notification not found");
        }

        UserNotification::where('notification_id', $notification->id)->where('user_id', Auth::user()->id)->update(['is_read' => true]);

        return sendResponse(null, 200, "Notification marked as read successfully");
    }

    public function markAllAsRead(Request $request)
    {
        UserNotification::where('user_id', Auth::user()->id)->update(['is_read' => true]);

        return sendResponse(null, 200, "Notification marked as read successfully");
    }

    private function setNotificationToUser($notification, $to = 'all')
    {
        $users = User::when($to, function ($query) use ($to) {

            if ($to != "all") {
                $query->where('business_name', $to);
            }

        })->get();

        foreach ($users as $user) {
            UserNotification::create([
                'user_id' => $user->id,
                'notification_id' => $notification->id
            ]);

            Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post('https://exp.host/--/api/v2/push/send', [
                        'to' => $user->push_noti_token,
                        'sound' => 'default',
                        'title' => $notification->title,
                        'body' => $notification->body ?? '',
                    ]);

        }
    }

    private function changeToArray($data)
    {
        return [
            'title' => $data['title'],
            'body' => $data['body'] ?? null,
        ];
    }

}
