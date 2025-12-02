<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Upload profile picture
     */
    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
        ]);

        $user = Auth::user();

        // Delete old profile picture if exists
        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        // Store new profile picture
        $path = $request->file('profile_picture')->store('profile_pictures', 'public');

        // Update user profile
        $user->profile_picture = $path;
        $user->save();

        return response()->json([
            'message' => 'Profile picture uploaded successfully',
            'profile_picture' => $path,
            'url' => Storage::url($path)
        ]);
    }

    /**
     * Get profile picture URL
     */
    public function getProfilePicture($userId)
    {
        $user = \App\Models\User::find($userId);

        if (!$user || !$user->profile_picture) {
            return response()->json(['message' => 'Profile picture not found'], 404);
        }

        return response()->json([
            'profile_picture' => $user->profile_picture,
            'url' => Storage::url($user->profile_picture)
        ]);
    }

    /**
     * Delete profile picture
     */
    public function deleteProfilePicture()
    {
        $user = Auth::user();

        if (!$user->profile_picture) {
            return response()->json(['message' => 'No profile picture to delete'], 404);
        }

        // Delete from storage
        Storage::disk('public')->delete($user->profile_picture);

        // Update user profile
        $user->profile_picture = null;
        $user->save();

        return response()->json(['message' => 'Profile picture deleted successfully']);
    }
}
