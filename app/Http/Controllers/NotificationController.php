<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Business;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\UserNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\NotificationResourceForADB;

class NotificationController extends Controller
{
    public function __construct(protected Notification $model)
    {
    }

    public function notificationsPage()
    {

        $notifications = Notification::with('business')->orderBy('id', 'desc')->get();
        $businesses = Business::all();

        return Inertia::render('Notifications/Index', [
            'notifications' => NotificationResourceForADB::collection($notifications),
            'businesses' => $businesses
        ]);
    }

    public function createPage()
    {

        $businesses = Business::all();

        return Inertia::render('Notifications/Create', [
            'businesses' => $businesses
        ]);
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

            $this->setNotificationToUser($notification);

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
            return back()->withErrors($e->getMessage());
        }

        return redirect()->route('notificationsPage')->with('success', 'Notification created successfully');

    }

    public function editPage($id)
    {

        $notification = $this->model->find($id);
        $notification->image = $notification->image ? url('storage/notification_images/' . $notification->image) : null;
        $businesses = Business::all();

        return Inertia::render('Notifications/Edit', [
            'notification' => $notification,
            'businesses' => $businesses
        ]);

    }

    public function update(Request $request)
    {

        $request->validate([
            'title' => 'required',
            'to' => 'required',
        ]);

        DB::beginTransaction();
        try {

            $notification = $this->model->find($request->id);
            $notification->title = $request->title;
            $notification->body = $request->body;
            $notification->business_id = $request->to == 'all' ? null : $request->to;
            $notification->save();

            UserNotification::where('notification_id', $notification->id)->delete();
            $this->setNotificationToUser($notification);

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

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }

        return redirect()->route('notificationsPage')->with('success', 'Notification updated successfully');
    }

    public function destroy(Request $request)
    {

        $notification = $this->model->find($request->id);
        if (!$notification) {
            return back()->withErrors('Notification already deleted');
        }

        UserNotification::where('notification_id', $notification->id)->delete();
        $notification->delete();
        return back()->with('success', 'Notification deleted successfully');

    }

    private function setNotificationToUser($notification)
    {
        $users = User::when($notification->business_id != null, function ($query) use ($notification) {

            $query->where('business_id', $notification->business_id);

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
            'business_id' => $data['to'] == 'all' ? null : $data['to'],
        ];
    }

}
