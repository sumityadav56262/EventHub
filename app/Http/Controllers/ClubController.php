<?php

namespace App\Http\Controllers;

use App\Models\Club;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClubController extends Controller
{
    public function index()
    {
        return response()->json(Club::all());
    }

    public function show($id)
    {
        return response()->json(Club::with('events')->findOrFail($id));
    }

    public function subscribe(Request $request, $club_id)
    {
        $user = Auth::user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Only students can subscribe'], 403);
        }

        $student = $user->student;

        if (!$student) {
             return response()->json(['message' => 'Student profile not found'], 404);
        }

        $subscription = Subscription::where('student_id', $student->id)
            ->where('club_id', $club_id)
            ->first();

        if ($subscription) {
            $subscription->delete();
            return response()->json(['message' => 'Unsubscribed successfully']);
        } else {
            Subscription::create([
                'student_id' => $student->id,
                'club_id' => $club_id,
            ]);
            return response()->json(['message' => 'Subscribed successfully']);
        }
    }
}
