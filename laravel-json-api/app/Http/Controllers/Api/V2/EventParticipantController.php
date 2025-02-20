<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Mail\EventRegistrationConfirmation;
use App\Models\Event;
use App\Models\EventParticipant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EventParticipantController extends Controller
{
    // Join an event
    public function join(Request $request, $eventId)
    {
        $event = Event::findOrFail($eventId);

        $existingParticipation = EventParticipant::where('user_id', auth()->id())
            ->where('event_id', $event->id)
            ->exists();

        if ($existingParticipation) {
            return response()->json(['message' => 'You are already participating in this event'], 409);
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
        

        $participation = EventParticipant::create([
            'user_id' => auth()->id(),
            'event_id' => $event->id,
        ]);

        Mail::to(auth()->user()->email)->send(new EventRegistrationConfirmation($event));

        return response()->json(['message' => 'Participation recorded successfully', 'data' => $participation]);
    }



}
