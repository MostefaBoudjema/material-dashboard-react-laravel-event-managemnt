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
     * Get all payments for the authenticated user
     */
    public function index()
    {
        try {
            $payments = PaymentHistory::where('user_id', auth()->id())
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($payments);
        } catch (\Exception $e) {
            Log::error('Error fetching payments: ' . $e->getMessage(), [
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'error' => 'Failed to fetch payments'
            ], 500);
        }
    }

    /**
     * Get a specific payment
     */
    public function show($id)
    {
        try {
            $payment = PaymentHistory::where('user_id', auth()->id())
                ->where('id', $id)
                ->first();

            if (!$payment) {
                return response()->json([
                    'error' => 'Payment not found'
                ], 404);
            }

            return response()->json($payment);
        } catch (\Exception $e) {
            Log::error('Error fetching payment: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'payment_id' => $id
            ]);

            return response()->json([
                'error' => 'Failed to fetch payment'
            ], 500);
        }
    }

    /**
     * Update a payment
     */
    public function update(Request $request, $id)
    {
        try {
            $payment = PaymentHistory::where('user_id', auth()->id())
                ->where('id', $id)
                ->first();

            if (!$payment) {
                return response()->json([
                    'error' => 'Payment not found'
                ], 404);
            }

            // Only allow updating certain fields
            $allowedFields = ['status', 'metadata'];
            $updateData = array_intersect_key($request->all(), array_flip($allowedFields));

            $payment->update($updateData);

            return response()->json($payment);
        } catch (\Exception $e) {
            Log::error('Error updating payment: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'payment_id' => $id
            ]);

            return response()->json([
                'error' => 'Failed to update payment'
            ], 500);
        }
    }

    /**
     * Delete a payment
     */
    public function destroy($id)
    {
        try {
            $payment = PaymentHistory::where('user_id', auth()->id())
                ->where('id', $id)
                ->first();

            if (!$payment) {
                return response()->json([
                    'error' => 'Payment not found'
                ], 404);
            }

            $payment->delete();

            return response()->json([
                'message' => 'Payment deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting payment: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'payment_id' => $id
            ]);

            return response()->json([
                'error' => 'Failed to delete payment'
            ], 500);
        }
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