<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\WhatsAppMessage;

class WhatsAppController extends Controller
{
    private $whatsappApiUrl;
    private $whatsappToken;
    private $twilioAccountSid;

    public function __construct()
    {
        // Configure these values in your .env file
        $this->whatsappApiUrl = config('services.whatsapp.api_url');
        $this->whatsappToken = config('services.whatsapp.token');
        $this->twilioAccountSid = config('services.whatsapp.account_sid');

        // Log configuration for debugging
        Log::info('WhatsApp Configuration', [
            'api_url' => $this->whatsappApiUrl,
            'token_exists' => !empty($this->whatsappToken),
            'account_sid_exists' => !empty($this->twilioAccountSid)
        ]);
    }

    public function sendMessage(Request $request)
    {
        try {
            // Log the raw request for debugging
            Log::info('Raw WhatsApp Request', [
                'content' => $request->getContent(),
                'headers' => $request->headers->all(),
                'all_data' => $request->all(),
                'json' => $request->json()->all()
            ]);

            // Get the request data and handle double-encoded JSON
            $data = $request->json()->all();
            if (isset($data['body']) && is_string($data['body'])) {
                $data = json_decode($data['body'], true);
            }

            if (empty($data)) {
                $data = $request->all();
            }

            // Validate request
            $validated = validator($data, [
                'phoneNumber' => 'required|string|regex:/^\+[1-9]\d{1,14}$/',
                'message' => 'required|string|max:4096',
            ])->validate();

            // Format phone number (remove any spaces or special characters)
            $phoneNumber = preg_replace('/[^0-9+]/', '', $validated['phoneNumber']);

            // Validate configuration
            if (empty($this->whatsappApiUrl) || empty($this->whatsappToken) || empty($this->twilioAccountSid)) {
                Log::error('WhatsApp Configuration Missing', [
                    'api_url_exists' => !empty($this->whatsappApiUrl),
                    'token_exists' => !empty($this->whatsappToken),
                    'account_sid_exists' => !empty($this->twilioAccountSid)
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'WhatsApp configuration is incomplete'
                ], 500);
            }

            // Log request data (excluding sensitive information)
            Log::info('Sending WhatsApp Message', [
                'phone_number' => $phoneNumber,
                'message_length' => strlen($validated['message'])
            ]);

            // Make API call to Twilio WhatsApp service
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode($this->twilioAccountSid . ':' . $this->whatsappToken)
            ])->asForm()
            ->post($this->whatsappApiUrl, [
                'From' => 'whatsapp:+14155238886', // Replace with your Twilio WhatsApp number
                'To' => 'whatsapp:' . $phoneNumber,
                'Body' => $validated['message']
            ]);

            // Save message to database
            WhatsAppMessage::create([
                'user_id' => auth()->id(),
                'to' => $phoneNumber,
                'from' => '+14155238886',
                'body' => $validated['message'],
                'status' => $response->successful() ? 'sent' : 'failed',
                'response' => $response->json(),
                'error_message' => $response->successful() ? null : ($response->body() ?: 'Unknown error'),
            ]);

            // Log the complete response for debugging
            Log::info('WhatsApp API Response', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Message sent successfully'
                ]);
            }

            Log::error('WhatsApp API Error', [
                'response' => $response->body(),
                'status' => $response->status(),
                'headers' => $response->headers()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send message: ' . ($response->body() ?: 'Unknown error')
            ], $response->status());

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('WhatsApp Validation Error', [
                'errors' => $e->errors(),
                'request_data' => $request->all(),
                'json_data' => $request->json()->all(),
                'parsed_data' => $data ?? null
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('WhatsApp Integration Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while sending the message: ' . $e->getMessage()
            ], 500);
        }
    }
} 