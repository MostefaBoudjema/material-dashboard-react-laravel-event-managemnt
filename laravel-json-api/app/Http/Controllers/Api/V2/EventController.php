<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Validator;

class EventController extends Controller
{
    // Fetch events based on role
    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('Admin')) {
            $events = Event::all();
        } else {
            $events = Event::where('status', 'published')->get();
        }

        return response()->json($events);
    }

    // Show a single event
    public function show(Event $event)
    {
        return response()->json($event);
    }

    // Create a new event
    public function store(Request $request)
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'date_time' => 'required|date',
            'duration' => 'required|integer',
            'location' => 'required|string',
            'capacity' => 'required|integer',
            'waitlist_capacity' => 'required|integer',
            'status' => 'required|string|in:published,draft',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create the event
        $event = Event::create($request->all());

        return response()->json(['message' => 'Event created successfully', 'event' => $event], 201);
    }

    // Update an existing event
    public function update(Request $request, Event $event)
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'date_time' => 'nullable|date',
            'duration' => 'nullable|integer',
            'location' => 'nullable|string',
            'capacity' => 'nullable|integer',
            'waitlist_capacity' => 'nullable|integer',
            'status' => 'nullable|string|in:published,draft',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update event data
        $event->update($request->all());

        return response()->json(['message' => 'Event updated successfully', 'event' => $event]);
    }

    // Delete an event
    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(['message' => 'Event deleted successfully']);
    }

    // Join an event
    public function join(Event $event)
    {
        $user = auth()->user();

        if ($user->events()->where('event_id', $event->id)->exists()) {
            return response()->json(['message' => 'Already joined'], 409);
        }

        if ($event->users()->count() >= $event->capacity) {
            return response()->json(['message' => 'Event is full'], 400);
        }

        $user->events()->attach($event->id);

        return response()->json(['message' => 'Successfully joined']);
    }
}
