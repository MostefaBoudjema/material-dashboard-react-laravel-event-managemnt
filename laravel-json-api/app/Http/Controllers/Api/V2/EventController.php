<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V2\EventRequest;
use App\Models\Event;
use App\Models\EventParticipant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Validator;

class EventController extends Controller
{
    // Fetch events based on role
    public function index()
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole('Admin');

        $eventsQuery = Event::withCount('participants')
            ->with(['participants' => function ($query) {
                $query->where('user_id', auth()->id());
            }])
            ->orderBy('date_time');

        if (!$isAdmin) {
            $eventsQuery->where('status', 'published');
        }

        $events = $eventsQuery->get()->map(function ($event) use ($isAdmin) {
            $event->is_participating = $event->participants->isNotEmpty();
            $event->is_admin = $isAdmin; // Add is_admin property
            $event->is_past = Carbon::parse($event->date_time)->isPast(); // Check if event is in the past
            unset($event->participants);
            return $event;
        });

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

        if (!auth()->user()->isAdmin()) {
            return response()->json(['message' => 'You don\'t have permission to create'], 409);
        }

        $event = Event::create($request->validated());

        return response()->json(['message' => 'Event created successfully', 'event' => $event], 201);
    }


    // Update an existing event
    public function update(EventRequest $request, Event $event)
    {
        // if (!collect(auth()->user()->getRoleNames())->map(fn($role) => strtolower($role))->contains('admin')) {
        if (!auth()->user()->isAdmin()) {
            return response()->json(['message' => 'You don\'t have permission to update'], 409);
        }

        // Update event data
        $event->update($request->all());

        return response()->json(['message' => 'Event updated successfully', 'event' => $event]);
    }

    // Delete an event
    public function destroy(Event $event)
    {


        if (!auth()->user()->isAdmin()) {
            return response()->json(['message' => 'You don\'t have permission to delete'], 409);
        }
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
