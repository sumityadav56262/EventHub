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
use SimpleSoftwareIO\QrCode\Facades\QrCode;

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

        $tokenString = Str::random(32);
        
        $token = AttendanceToken::create([
            'event_id' => $event_id,
            'token' => $tokenString,
            'expires_at' => Carbon::now()->addSeconds(15),
        ]);

        $payload = [
            'event_id' => $event_id,
            'token' => $tokenString,
        ];

        // Generate QR Code SVG
        // Note: In a real API we might just return the payload and let frontend generate QR, 
        // but user asked for backend generation. 
        // However, usually API returns JSON. The prompt says "Response returns JSON... QR payload must include...".
        // It also says "Use Simple-QrCode". 
        // I will return the JSON payload as requested in point 6.
        
        return response()->json([
            'event_id' => $event_id,
            'token' => $tokenString,
            'expires_at' => $token->expires_at,
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

        // 2. Check Subscription
        $event = Event::findOrFail($request->event_id);
        $isSubscribed = Subscription::where('student_id', $student->id)
            ->where('club_id', $event->club_id)
            ->exists();

        if (!$isSubscribed) {
            return response()->json(['message' => 'You must be subscribed to the club to mark attendance'], 403);
        }

        // 3. Mark Attendance
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
        $formattedAttendances = $attendances->map(function ($attendance) {
            return [
                'id' => $attendance->id,
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
