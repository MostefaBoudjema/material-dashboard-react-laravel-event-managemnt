<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class EventReminderNotification extends Notification
{
    use Queueable;

    public $event;

    public function __construct($event)
    {
        $this->event = $event;
    }

    public function via($notifiable)
    {
        return ['mail']; // or 'database', 'sms', etc.
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Reminder: Upcoming Event Today')
                    ->line("You have an event today: {$this->event->name} at {$this->event->date_time}.")
                    ->action('View Event', url('/events/' . $this->event->id));
    }
}
