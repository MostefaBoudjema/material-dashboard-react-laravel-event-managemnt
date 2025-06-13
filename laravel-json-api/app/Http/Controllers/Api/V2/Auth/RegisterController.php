<?php

namespace App\Http\Controllers\Api\V2\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V2\Auth\RegisterRequest;
use App\Services\PhoneVerificationService;
use Illuminate\Support\Facades\Log;
use LaravelJsonApi\Core\Document\Error;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Api\V2\Auth\LoginRequest;
use App\Models\User;

class RegisterController extends Controller
{
    protected $verificationService;

    public function __construct(PhoneVerificationService $verificationService)
    {
        $this->verificationService = $verificationService;
    }

    /**
     * Handle the incoming request.
     *
     * @param \App\Http\Requests\Api\V2\Auth\RegisterRequest $request
     *
     * @return \Symfony\Component\HttpFoundation\Response|\LaravelJsonApi\Core\Document\Error
     * @throws \Exception
     */
    public function __invoke(RegisterRequest $request): Response|Error
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone_number' => $request->phone_number,
            'password' => $request->password,
        ]);
    
        $user->assignRole('User');

        // Send verification code
        try {
            $this->verificationService->sendVerificationCode($user);
        } catch (\Exception $e) {
            // Log the error but don't fail registration
            Log::error('Failed to send verification code: ' . $e->getMessage());
        }

        return (new LoginController)(new LoginRequest($request->only(['email', 'password'])));
    }
}
