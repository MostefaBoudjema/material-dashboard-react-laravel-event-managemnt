<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    public function run()
    {
        Event::create([
            'name' => 'Tech Conference 2025',
            'date_time' => Carbon::parse('2025-05-10 09:00:00'),
            'duration' => 120,
            'location' => 'Conference Hall A, New York',
            'capacity' => 200,
            'waitlist_capacity' => 50,
            'status' => 'published',
        ]);

        Event::create([
            'name' => 'Web Development Workshop',
            'date_time' => Carbon::parse('2025-06-20 10:00:00'),
            'duration' => 180,
            'location' => 'Room 203, San Francisco',
            'capacity' => 50,
            'waitlist_capacity' => 20,
            'status' => 'draft',
        ]);

        Event::create([
            'name' => 'AI Summit 2025',
            'date_time' => Carbon::parse('2025-07-15 08:00:00'),
            'duration' => 150,
            'location' => 'Hall B, Chicago',
            'capacity' => 300,
            'waitlist_capacity' => 100,
            'status' => 'published',
        ]);

        Event::create([
            'name' => 'Blockchain Conference',
            'date_time' => Carbon::parse('2025-08-10 11:00:00'),
            'duration' => 200,
            'location' => 'Grand Ballroom, Los Angeles',
            'capacity' => 250,
            'waitlist_capacity' => 75,
            'status' => 'draft',
        ]);

        Event::create([
            'name' => 'React Dev Meetup',
            'date_time' => Carbon::parse('2025-09-05 13:00:00'),
            'duration' => 120,
            'location' => 'Tech Hub, Boston',
            'capacity' => 100,
            'waitlist_capacity' => 30,
            'status' => 'published',
        ]);

        Event::create([
            'name' => 'UX/UI Design Workshop',
            'date_time' => Carbon::parse('2025-10-01 14:00:00'),
            'duration' => 180,
            'location' => 'Design Studio, Seattle',
            'capacity' => 50,
            'waitlist_capacity' => 15,
            'status' => 'published',
        ]);

        Event::create([
            'name' => 'Fullstack Development Bootcamp',
            'date_time' => Carbon::parse('2025-11-10 09:30:00'),
            'duration' => 240,
            'location' => 'Room 101, Austin',
            'capacity' => 60,
            'waitlist_capacity' => 20,
            'status' => 'draft',
        ]);

        Event::create([
            'name' => 'Cloud Computing Expo',
            'date_time' => Carbon::parse('2025-12-20 10:00:00'),
            'duration' => 150,
            'location' => 'Convention Center, Miami',
            'capacity' => 500,
            'waitlist_capacity' => 200,
            'status' => 'published',
        ]);

        Event::create([
            'name' => 'AI for Business Seminar',
            'date_time' => Carbon::parse('2025-06-30 09:00:00'),
            'duration' => 120,
            'location' => 'Office Park, Denver',
            'capacity' => 80,
            'waitlist_capacity' => 30,
            'status' => 'draft',
        ]);

        Event::create([
            'name' => 'Laravel Dev Conference',
            'date_time' => Carbon::parse('2025-07-25 15:00:00'),
            'duration' => 180,
            'location' => 'Tech Center, San Diego',
            'capacity' => 120,
            'waitlist_capacity' => 40,
            'status' => 'published',
        ]);
    }
}

