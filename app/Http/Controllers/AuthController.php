<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:student,teacher,club',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        if ($request->role === 'student') {
            $request->validate([
                'QID' => 'required|string|unique:students',
                'programme' => 'required|string',
                'course' => 'required|string',
                'section' => 'required|string',
            ]);

            Student::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'QID' => $request->QID,
                'programme' => $request->programme,
                'course' => $request->course,
                'section' => $request->section,
                'specialization' => $request->specialization,
            ]);
        } elseif ($request->role === 'teacher') {
            $request->validate([
                'teacher_id' => 'required|string|unique:teachers',
                'department' => 'required|string',
            ]);

            Teacher::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'teacher_id' => $request->teacher_id,
                'department' => $request->department,
            ]);
        } elseif ($request->role === 'club') {
            $request->validate([
                'club_name' => 'required|string',
                'club_code' => 'required|string|unique:clubs',
                'club_email' => 'required|string|email|unique:clubs',
                'faculty_incharge' => 'required|string',
            ]);

            Club::create([
                'user_id' => $user->id,
                'club_name' => $request->club_name,
                'club_code' => $request->club_code,
                'club_email' => $request->club_email,
                'faculty_incharge' => $request->faculty_incharge,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'role' => $user->role,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function signupStudent(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'QID' => 'required|string|unique:students',
            'programme' => 'required|string',
            'course' => 'required|string',
            'section' => 'required|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'student',
        ]);

        Student::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'QID' => $request->QID,
            'programme' => $request->programme,
            'course' => $request->course,
            'section' => $request->section,
            'specialization' => $request->specialization,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Student registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function signupTeacher(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'teacher_id' => 'required|string|unique:teachers',
            'department' => 'required|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'teacher',
        ]);

        Teacher::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'teacher_id' => $request->teacher_id,
            'department' => $request->department,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Teacher registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function signupClub(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'club_name' => 'required|string',
            'club_code' => 'required|string|unique:clubs',
            'club_email' => 'required|string|email|unique:clubs',
            'faculty_incharge' => 'required|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'club',
        ]);

        Club::create([
            'user_id' => $user->id,
            'club_name' => $request->club_name,
            'club_code' => $request->club_code,
            'club_email' => $request->club_email,
            'faculty_incharge' => $request->faculty_incharge,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Club registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }
}
