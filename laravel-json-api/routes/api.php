<?php

use App\Http\Controllers\Api\V2\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use LaravelJsonApi\Laravel\Routing\ResourceRegistrar;
use App\Http\Controllers\Api\V2\Auth\LoginController;
use App\Http\Controllers\Api\V2\Auth\LogoutController;
use App\Http\Controllers\Api\V2\Auth\RegisterController;
use App\Http\Controllers\Api\V2\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\V2\Auth\ResetPasswordController;
use App\Http\Controllers\Api\V2\EventController;
use App\Http\Controllers\Api\V2\EventParticipantController;
use App\Http\Controllers\Api\V2\EventWaitlistController;
use App\Http\Controllers\Api\V2\MeController;
use App\Http\Controllers\Api\V2\RoleController;
use LaravelJsonApi\Laravel\Facades\JsonApiRoute;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
use App\Http\Controllers\Api\V2\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v2')->middleware('json.api')->group(function () {

    Route::post('/login', LoginController::class)->name('login');
    Route::post('/logout', LogoutController::class)->middleware('auth:api');
    Route::post('/register', RegisterController::class);
    Route::post('/password-forgot', ForgotPasswordController::class);
    Route::post('/password-reset', ResetPasswordController::class)->name('password.reset');
});

JsonApiRoute::server('v2')->prefix('v2')->resources(function (ResourceRegistrar $server) {
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');

    $server->resource('users', JsonApiController::class);
    Route::get('me', [MeController::class, 'readProfile']);
    Route::patch('me', [MeController::class, 'updateProfile']);
    
    Route::get('/events/joined', [EventController::class, 'joinedEventsToday']);
    Route::get('/auth_user', [UserController::class, 'auth_user']);
    Route::resource('events', EventController::class);
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
    Route::post('/events/{eventId}/join', [EventParticipantController::class, 'join'])->middleware('event.capacity');
    Route::post('/events/{eventId}/cancel', [EventParticipantController::class, 'cancel']);
    Route::post('/waitlist/{eventId}/join', [EventWaitlistController::class, 'joinWaitlist']);
    Route::post('/payments/intent', [PaymentController::class, 'createPaymentIntent'])->middleware('auth:api');

});
