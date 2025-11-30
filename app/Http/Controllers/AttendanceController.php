<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\AttendanceToken;
use App\Models\Attendance;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function generateQr($event_id)
    {
        $user = Auth::user();
        // Check if user is the club owner of the event
        $event = Event::findOrFail($event_id);
        
        if ($user->role !== 'club' || $user->club->id !== $event->club_id) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Generate a new token
        $tokenString = Str::random(32);
        
        // Create token record with 20 seconds expiry (giving a bit of buffer over 15s)
        $token = AttendanceToken::create([
            'event_id' => $event_id,
            'token' => $tokenString,
            'expires_at' => Carbon::now()->addSeconds(20),
        ]);

        // Return JSON payload as requested
        return response()->json([
            'event_id' => (int)$event_id,
            'token' => $tokenString,
            'expires_at' => $token->expires_at->toIso8601String(),
        ]);
    }

    public function markAttendance(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'token' => 'required|string',
        ]);

        $user = Auth::user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Only students can mark attendance'], 403);
        }

        $student = $user->student;
        
        // 1. Validate Token
        $tokenRecord = AttendanceToken::where('token', $request->token)
            ->where('event_id', $request->event_id)
            ->first();

        if (!$tokenRecord) {
            return response()->json(['message' => 'Invalid token'], 400);
        }

        if (Carbon::now()->greaterThan($tokenRecord->expires_at)) {
            return response()->json(['message' => 'Token expired'], 400);
        }

        // 2. Check Event Status & Timing
        $event = Event::findOrFail($request->event_id);
        
        // Optional: Check if event is actually happening now
        // if (Carbon::now()->lt($event->start_time) || Carbon::now()->gt($event->end_time)) {
        //    return response()->json(['message' => 'Event is not active'], 400);
        // }

        // 3. Check Subscription
        $isSubscribed = Subscription::where('student_id', $student->id)
            ->where('club_id', $event->club_id)
            ->exists();

        if (!$isSubscribed) {
            return response()->json(['message' => 'You must be subscribed to the club to mark attendance'], 403);
        }

        // 4. Mark Attendance
        // Check if already marked
        $existing = Attendance::where('student_id', $student->id)
            ->where('event_id', $request->event_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Attendance already marked'], 200);
        }

        Attendance::create([
            'student_id' => $student->id,
            'event_id' => $request->event_id,
            'scanned_token' => $request->token,
            'status' => 'present',
        ]);

        return response()->json(['status' => 'success', 'message' => 'Attendance marked']);
    }

    public function liveAttendance($event_id)
    {
        $attendances = Attendance::where('event_id', $event_id)
            ->with('student')
            ->orderBy('created_at', 'desc')
            ->get();

        // Format the response for better frontend consumption
        $formattedAttendances = $attendances->map(function ($attendance, $index) {
            return [
                'id' => $attendance->id,
                's_no' => $index + 1, // Add S.No
                'name' => $attendance->student->name,
                'qid' => $attendance->student->QID,
                'course' => $attendance->student->course,
                'section' => $attendance->student->section,
                'programme' => $attendance->student->programme,
                'status' => $attendance->status,
                'timestamp' => $attendance->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return response()->json($formattedAttendances);
    }

    public function getEventAttendance($event_id)
    {
        $user = Auth::user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $student = $user->student;

        $attendance = Attendance::where('event_id', $event_id)
            ->where('student_id', $student->id)
            ->first();

        if (!$attendance) {
            return response()->json(['status' => 'not_marked'], 200);
        }

        return response()->json([
            'status' => $attendance->status,
            'marked_at' => $attendance->created_at,
        ]);
    }
}
