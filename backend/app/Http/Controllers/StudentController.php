<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Club;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function getProfile(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        return response()->json([
            'name' => $student->name,
            'email' => $user->email,
            'QID' => $student->QID,
            'programme' => $student->programme,
            'course' => $student->course,
            'section' => $student->section,
            'specialization' => $student->specialization,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'programme' => 'sometimes|string',
            'course' => 'sometimes|string',
            'section' => 'sometimes|string',
            'specialization' => 'sometimes|string',
        ]);

        $student->update($request->only(['name', 'programme', 'course', 'section', 'specialization']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'student' => $student,
        ]);
    }

    public function getSubscriptions(Request $request)
    {
        $user = $request->user();
        
        if ($user->role !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        // Get subscribed clubs
        $subscriptions = $student->clubs()->with('club')->get();

        return response()->json($subscriptions);
    }
}
