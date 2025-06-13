<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Twilio\Rest\Client;

class SmsNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function via($notifiable)
    {
        return ['twilio'];
    }

    public function toTwilio($notifiable)
    {
        $account_sid = config('services.twilio.account_sid');
        $auth_token = config('services.twilio.auth_token');
        $twilio_number = config('services.twilio.from');

        $client = new Client($account_sid, $auth_token);

        return $client->messages->create(
            $notifiable->phone_number, // The phone number to send to
            [
                'from' => $twilio_number,
                'body' => $this->message
            ]
        );
    }
} 