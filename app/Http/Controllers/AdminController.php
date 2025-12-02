<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get pending clubs awaiting approval
     */
    public function getPendingClubs()
    {
        $pendingClubs = User::where('role', 'club')
            ->where('status', 'pending')
            ->select('id', 'name', 'email', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pendingClubs);
    }

    /**
     * Approve a club
     */
    public function approveClub($id)
    {
        $club = User::where('id', $id)
            ->where('role', 'club')
            ->first();

        if (!$club) {
            return response()->json(['message' => 'Club not found'], 404);
        }

        $club->status = 'approved';
        $club->save();

        return response()->json([
            'message' => 'Club approved successfully',
            'club' => $club
        ]);
    }

    /**
     * Reject a club
     */
    public function rejectClub($id)
    {
        $club = User::where('id', $id)
            ->where('role', 'club')
            ->first();

        if (!$club) {
            return response()->json(['message' => 'Club not found'], 404);
        }

        $club->status = 'rejected';
        $club->save();

        return response()->json([
            'message' => 'Club rejected',
            'club' => $club
        ]);
    }

    /**
     * Get all clubs with their status
     */
    public function getAllClubs()
    {
        $clubs = User::where('role', 'club')
            ->select('id', 'name', 'email', 'status', 'created_at')
            ->withCount('events')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($clubs);
    }

    /**
     * Get all events across all clubs
     */
    public function getAllEvents()
    {
        $events = Event::with('club:id,name')
            ->select('id', 'title', 'club_id', 'start_time', 'end_time', 'venue', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($events);
    }

    /**
     * Get admin dashboard statistics
     */
    public function getStats()
    {
        $stats = [
            'total_clubs' => User::where('role', 'club')->count(),
            'pending_clubs' => User::where('role', 'club')->where('status', 'pending')->count(),
            'approved_clubs' => User::where('role', 'club')->where('status', 'approved')->count(),
            'total_students' => User::where('role', 'student')->count(),
            'total_events' => Event::count(),
            'upcoming_events' => Event::where('start_time', '>', now())->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Delete a club (soft delete or hard delete)
     */
    public function deleteClub($id)
    {
        $club = User::where('id', $id)
            ->where('role', 'club')
            ->first();

        if (!$club) {
            return response()->json(['message' => 'Club not found'], 404);
        }

        // Delete all events associated with this club
        Event::where('club_id', $id)->delete();
        
        // Delete the club
        $club->delete();

        return response()->json(['message' => 'Club deleted successfully']);
    }

    /**
     * Delete an event
     */
    public function deleteEvent($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
}
