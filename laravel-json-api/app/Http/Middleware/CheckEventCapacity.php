<?php

namespace App\Http\Middleware;

use App\Models\Event;
use App\Models\EventParticipant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckEventCapacity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $eventId = $request->route('eventId');
        $event = Event::findOrFail($eventId);

        $existingParticipation = EventParticipant::where('user_id', auth()->id())
            ->where('event_id', $event->id)
            ->exists();

        if ($existingParticipation) {
            return $next($request);
            // return response()->json(['message' => 'You are already participating in this event'], 409);
        }

        $participantsCount = $event->participants()->count();

        if ($participantsCount >= $event->capacity) {
            return response()->json(['message' => 'Event full, redirecting to waitlist...','status'=>'409'], 409);
        }
        

        return $next($request);
    }
}
