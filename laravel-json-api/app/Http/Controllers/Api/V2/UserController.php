<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V2\UserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function auth_user()
    {
        $user = auth()->user();
    
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        return response()->json($user->load('roles'));
    }
    
    
    public function index()
{
    $users = User::with('roles')->get()->map(function ($user) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->roles->first()->name ?? 'No Role', // Get the first role as a string
            'is_participating' => $user->is_participating,
        ];
    });

    return response()->json($users);
}



    // Show a single user
    public function show(User $user)
    {
        return response()->json($user);
    }

    // Create a new user
    public function store(UserRequest $request)
    {
        $user = User::create([
            ...$request->validated(),
            'password' => Hash::make('secret'),
        ]);
    
        $user->assignRole('User');
    
        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }
    


    // Update an existing user
    public function update(UserRequest $request, User $user)
    {
        // Update user data
        $user->update($request->all());

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    // Delete an user
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

}
