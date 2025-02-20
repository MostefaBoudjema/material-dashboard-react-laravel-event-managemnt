<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventParticipant;
use App\Models\EventWaitlist;
use Carbon\Carbon;
use Illuminate\Http\Request;

class EventWaitlistController extends Controller
{
    public function joinWaitlist(Request $request, $eventId)
    {
        $event = Event::findOrFail($eventId);

        $existingWaitlistParticipation = EventWaitlist::where('user_id', auth()->id())
            ->where('event_id', $event->id)
            ->exists();

        if ($existingWaitlistParticipation) {
            return response()->json(['message' => 'You already joined the waitlist of this event'], 409);
        }

        $userEvents = Event::whereHas('participants', function ($query) {
            $query->where('user_id', auth()->id());
        })->get();

        $eventStart = Carbon::parse($event->date_time);
        $eventEnd = $eventStart->copy()->addMinutes($event->duration);
        
        foreach ($userEvents as $userEvent) {
            $userEventStart = Carbon::parse($userEvent->date_time);
            $userEventEnd = $userEventStart->copy()->addMinutes($userEvent->duration);
        
            if ($eventStart->isSameDay($userEventStart) &&
                $eventStart->lt($userEventEnd) &&
                $eventEnd->gt($userEventStart)
            ) {
                return response()->json([
                    'message' => 'You are already participating in an overlapping event: ' . $userEvent->name,
                ], 409);
            }
        }
        

        $participation = EventWaitlist::create([
            'user_id' => auth()->id(),
            'event_id' => $event->id,
        ]);


        return response()->json(['message' => 'Participation recorded successfully', 'data' => $participation]);
    }
}
