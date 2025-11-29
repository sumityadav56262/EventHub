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

        return response()->json(['message' => 'Event created successfully', 'event' => $event], 201);
    }

    public function index($club_id)
    {
        $events = Event::where('club_id', $club_id)->get();
        return response()->json($events);
    }
}
