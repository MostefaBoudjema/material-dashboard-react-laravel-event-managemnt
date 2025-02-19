<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\EventReminderNotification;
use Carbon\Carbon;

class SendEventReminders extends Command
{
    protected $signature = 'events:send-reminders';
    protected $description = 'Send event reminder notifications to users for today\'s events';

    public function handle()
    {
        $today = Carbon::today()->toDateString();

        $eventsToday = Event::whereDate('date_time', $today)->get();

        foreach ($eventsToday as $event) {
            $users = $event->participants; // Assuming a relationship like $event->participants()

            Notification::send($users, new EventReminderNotification($event));
        }

        $this->info('Reminders sent successfully!');
    }
}

