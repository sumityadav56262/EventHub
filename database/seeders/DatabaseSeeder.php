<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Club;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Student
        $studentUser = User::create([
            'name' => 'John Student',
            'email' => 'student@example.com',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);
        Student::create([
            'user_id' => $studentUser->id,
            'name' => $studentUser->name,
            'QID' => 'S12345',
            'programme' => 'B.Tech',
            'course' => 'CSE',
            'section' => 'A',
            'specialization' => 'AI',
        ]);

        // Create Teacher
        $teacherUser = User::create([
            'name' => 'Jane Teacher',
            'email' => 'teacher@example.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
        ]);
        Teacher::create([
            'user_id' => $teacherUser->id,
            'name' => $teacherUser->name,
            'teacher_id' => 'T98765',
            'department' => 'CSE',
        ]);

        // Create Club
        $clubUser = User::create([
            'name' => 'Coding Club',
            'email' => 'club@example.com',
            'password' => Hash::make('password'),
            'role' => 'club',
        ]);
        Club::create([
            'user_id' => $clubUser->id,
            'club_name' => 'Coding Club',
            'club_code' => 'CC01',
            'club_email' => 'club@example.com',
            'faculty_incharge' => 'Dr. Smith',
        ]);
    }
}
