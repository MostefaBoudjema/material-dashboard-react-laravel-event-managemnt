<?php

namespace App\Services;

use App\Models\User;
use App\Models\PhoneVerification;
use Twilio\Rest\Client;
use Twilio\Exceptions\TwilioException;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PhoneVerificationService
{
    protected $twilioClient;

    public function __construct()
    {
        try {
            $this->twilioClient = new Client(
                config('services.twilio.account_sid'),
                config('services.twilio.auth_token')
            );
        } catch (\Exception $e) {
            Log::error('Failed to initialize Twilio client: ' . $e->getMessage());
            throw $e;
        }
    }

    public function sendVerificationCode(User $user): PhoneVerification
    {
        try {
            // Generate a 6-digit code
            $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Create verification record
            $verification = PhoneVerification::create([
                'user_id' => $user->id,
                'code' => $code,
                'expires_at' => Carbon::now()->addMinutes(10),
                'verified' => false
            ]);

            // Log the attempt to send SMS
            Log::info('Attempting to send verification code', [
                'user_id' => $user->id,
                'phone_number' => $user->phone_number,
                'code' => $code
            ]);

            // Send SMS
            $message = $this->twilioClient->messages->create(
                $user->phone_number,
                [
                    'from' => config('services.twilio.from'),
                    'body' => "Your verification code is: {$code}. This code will expire in 10 minutes."
                ]
            );

            // Log successful SMS delivery
            Log::info('SMS sent successfully', [
                'message_sid' => $message->sid,
                'status' => $message->status
            ]);

            return $verification;
        } catch (TwilioException $e) {
            // Log Twilio-specific errors
            Log::error('Twilio error while sending verification code: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'phone_number' => $user->phone_number,
                'error_code' => $e->getCode()
            ]);
            throw $e;
        } catch (\Exception $e) {
            // Log any other errors
            Log::error('Error while sending verification code: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'phone_number' => $user->phone_number
            ]);
            throw $e;
        }
    }

    public function verifyCode(User $user, string $code): bool
    {
        try {
            $verification = PhoneVerification::where('user_id', $user->id)
                ->where('code', $code)
                ->where('verified', false)
                ->where('expires_at', '>', Carbon::now())
                ->latest()
                ->first();

            if (!$verification) {
                Log::warning('Invalid verification attempt', [
                    'user_id' => $user->id,
                    'code' => $code
                ]);
                return false;
            }

            $verification->update(['verified' => true]);
            $user->update(['phone_verified_at' => Carbon::now()]);

            Log::info('Phone number verified successfully', [
                'user_id' => $user->id,
                'phone_number' => $user->phone_number
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Error during code verification: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'code' => $code
            ]);
            throw $e;
        }
    }
} 