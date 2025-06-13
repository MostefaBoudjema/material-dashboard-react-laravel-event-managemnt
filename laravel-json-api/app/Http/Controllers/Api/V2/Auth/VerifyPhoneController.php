<?php

namespace App\Http\Controllers\Api\V2\Auth;

use App\Http\Controllers\Controller;
use App\Services\PhoneVerificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use LaravelJsonApi\Core\Document\Error;
use Symfony\Component\HttpFoundation\Response;
use Twilio\Rest\Client;

class VerifyPhoneController extends Controller
{
    protected $verificationService;

    public function __construct(PhoneVerificationService $verificationService)
    {
        $this->verificationService = $verificationService;
    }

    public function testTwilio()
    {
        try {
            $client = new Client(
                config('services.twilio.account_sid'),
                config('services.twilio.auth_token')
            );

            // Try to fetch account info to verify credentials
            $account = $client->api->accounts(config('services.twilio.account_sid'))->fetch();

            return response()->json([
                'status' => 'success',
                'message' => 'Twilio configuration is valid',
                'account_sid' => config('services.twilio.account_sid'),
                'from_number' => config('services.twilio.from'),
                'account_status' => $account->status
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Twilio configuration error: ' . $e->getMessage(),
                'account_sid' => config('services.twilio.account_sid'),
                'from_number' => config('services.twilio.from')
            ], 500);
        }
    }

    public function verify(Request $request): Response|Error
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6']
        ]);

        $user = Auth::user();
        
        if ($this->verificationService->verifyCode($user, $request->code)) {
            return response()->json([
                'message' => 'Phone number verified successfully'
            ]);
        }

        return response()->json([
            'message' => 'Invalid or expired verification code'
        ], 400);
    }

    public function resend(): Response|Error
    {
        $user = Auth::user();
        
        try {
            $this->verificationService->sendVerificationCode($user);
            return response()->json([
                'message' => 'Verification code sent successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send verification code: ' . $e->getMessage()
            ], 500);
        }
    }
} 