<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V2\EventRequest;
use App\Models\Event;
use App\Models\EventParticipant;
use Illuminate\Http\Request;
use Validator;

class EventController extends Controller
{
    // Fetch events based on role
    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('Admin')) {
            // $events = Event::withCount('participants')->get();
            $events = Event::withCount('participants')
                ->with(['participants' => function ($query) {
                    $query->where('user_id', auth()->id());
                }])
                ->get()
                ->map(function ($event) {
                    $event->is_participating = $event->participants->isNotEmpty();
                    unset($event->participants);
                    return $event;
                });
        } else {
            // $events = Event::where('status', 'published')->withCount('participants')->get();
            $events = Event::where('status', 'published')
                ->withCount('participants')
                ->with(['participants' => function ($query) {
                    $query->where('user_id', auth()->id());
                }])
                ->get()
                ->map(function ($event) {
                    $event->is_participating = $event->participants->isNotEmpty();
                    unset($event->participants);
                    return $event;
                });
        }

        return response()->json($events);
    }

    // Show a single event
    public function show(Event $event)
    {
        return response()->json($event);
    }

    // Create a new event
    public function store(EventRequest $request)
    {
        $event = Event::create($request->validated());

        return response()->json(['message' => 'Event created successfully', 'event' => $event], 201);
    }


    // Update an existing event
    public function update(EventRequest $request, Event $event)
    {
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


    public function joinedEventsToday(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $joinedEvents = EventParticipant::where('user_id', $user->id)
            ->whereHas('event', function ($query) use ($today) {
                $query->whereDate('date_time', $today);
            })
            ->with('event')
            ->get();

        return response()->json($joinedEvents);
    }
}
