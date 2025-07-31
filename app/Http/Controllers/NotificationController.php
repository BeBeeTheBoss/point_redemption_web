<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResourceForADB;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Business;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\UserNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class NotificationController extends Controller
{
    public function __construct(protected Notification $model)
    {
    }

    public function notificationsPage()
    {

        $notifications = Notification::with('business')->get();

        return Inertia::render('Notifications/Index', [
            'notifications' => NotificationResourceForADB::collection($notifications)
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

    private function setNotificationToUser($notification)
    {
        $users = User::when($notification->to, function ($query) use ($notification) {

            if ($notification->to != "all") {
                $query->where('business_id', $notification->to);
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
            'business_id' => $data['to'] == 'all' ? null : $data['to'],
        ];
    }

}
