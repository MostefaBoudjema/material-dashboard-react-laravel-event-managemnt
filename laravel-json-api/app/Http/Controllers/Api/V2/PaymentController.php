<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;
use App\Models\PaymentHistory;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api'); // Require authentication
    }

    /**
     * Create a Stripe Payment Intent
     */
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'currency' => 'required|string|size:3',
        ]);

        try {
            // Set Stripe API key
            Stripe::setApiKey(config('services.stripe.secret'));

            // Log the attempt
            Log::info('Creating payment intent', [
                'amount' => $request->amount,
                'currency' => $request->currency,
                'user_id' => auth()->id()
            ]);

            // Create the payment intent
            $paymentIntent = PaymentIntent::create([
                'amount' => intval($request->amount * 100), // Stripe expects amount in cents
                'currency' => $request->currency,
                'metadata' => [
                    'user_id' => auth()->id(),
                ],
            ]);

            // Save payment intent to local database
            PaymentHistory::create([
                'user_id' => auth()->id(),
                'stripe_payment_intent_id' => $paymentIntent->id,
                'amount' => $paymentIntent->amount,
                'currency' => $paymentIntent->currency,
                'status' => $paymentIntent->status,
                'client_secret' => $paymentIntent->client_secret,
                'metadata' => $paymentIntent->metadata ?? [],
            ]);

            // Log success
            Log::info('Payment intent created successfully', [
                'payment_intent_id' => $paymentIntent->id
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);
        } catch (ApiErrorException $e) {
            // Log Stripe API errors
            Log::error('Stripe API Error: ' . $e->getMessage(), [
                'error_code' => $e->getStripeCode(),
                'http_status' => $e->getHttpStatus(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'error' => 'Unable to create payment intent: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            // Log other errors
            Log::error('Payment Intent Error: ' . $e->getMessage(), [
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'error' => 'An unexpected error occurred'
            ], 500);
        }
    }
} 