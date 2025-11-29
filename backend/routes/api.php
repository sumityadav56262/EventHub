<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AttendanceController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/signup/student', [AuthController::class, 'signupStudent']);
Route::post('/auth/signup/teacher', [AuthController::class, 'signupTeacher']);
Route::post('/auth/signup/club', [AuthController::class, 'signupClub']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Club Routes
    Route::get('/clubs', [ClubController::class, 'index']);
    Route::get('/clubs/{id}', [ClubController::class, 'show']);
    Route::post('/clubs/subscribe/{club_id}', [ClubController::class, 'subscribe']);

    // Event Routes
    Route::post('/events/create', [EventController::class, 'store']);
    Route::get('/events/club/{club_id}', [EventController::class, 'index']);

    // Attendance Routes
    Route::get('/attendance/qr/{event_id}', [AttendanceController::class, 'generateQr']);
    Route::post('/attendance/mark', [AttendanceController::class, 'markAttendance']);
    Route::get('/attendance/live/{event_id}', [AttendanceController::class, 'liveAttendance']);
});
