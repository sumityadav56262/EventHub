<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'club') {
            return response()->json(['message' => 'Only clubs can create events'], 403);
        }

        // Check if club is approved
        if ($user->status !== 'approved') {
            return response()->json([
                'message' => 'Your club registration is pending admin approval. You cannot create events yet.',
                'status' => $user->status
            ], 403);
        }

        $club = $user->club;

        if (!$club) {
            return response()->json(['message' => 'Club profile not found'], 404);
        }

        $request->validate([
            'title' => 'required|string',
            'venue' => 'required|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        $event = Event::create([
            'club_id' => $club->id,
            'title' => $request->title,
            'description' => $request->description,
            'venue' => $request->venue,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        // Send notifications to all subscribers
        $subscribers = $club->subscribers; // Assuming club has subscribers relationship
        foreach ($subscribers as $subscriber) {
            \App\Models\Notification::create([
                'user_id' => $subscriber->id,
                'type' => 'event_created',
                'title' => 'New Event from ' . $club->club_name,
                'message' => $event->title . ' on ' . date('M d, Y', strtotime($event->start_time)),
                'data' => json_encode(['event_id' => $event->id, 'club_id' => $club->id])
            ]);
        }

        return response()->json(['message' => 'Event created successfully', 'event' => $event], 201);
    }

    public function upcoming()
    {
        $events = Event::with('club')
            ->where('start_time', '>=', now())
            ->orderBy('start_time', 'asc')
            ->get();
        
        return response()->json($events);
    }

    public function show($id)
    {
        $event = Event::with('club')->find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        return response()->json($event);
    }

    public function getClubEvents()
    {
        $user = Auth::user();
        $club_id = Club::where('user_id', $user->id)->first()->id;
        $events = Event::where('club_id', $club_id)
            ->orderBy('start_time', 'desc')
            ->get();
        
        return response()->json($events);
    }

    public function index($club_id)
    {
        $events = Event::where('club_id', $club_id)->get();
        return response()->json($events);
    }
}
