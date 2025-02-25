<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V2\RoleRequest;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    
    
    public function index()
{
    $roles = Role::with('permissions')->get();

    return response()->json($roles);
}



    // Show a single role
    public function show(Role $role)
    {
        return response()->json($role);
    }

    // Create a new role
    public function store(RoleRequest $request)
    {
        $role = Role::create($request->validated());

        return response()->json(['message' => 'Role created successfully', 'role' => $role], 201);
    }


    // Update an existing role
    public function update(RoleRequest $request, Role $role)
    {
        // Update role data
        $role->update($request->all());

        return response()->json(['message' => 'Role updated successfully', 'role' => $role]);
    }

    // Delete an role
    public function destroy(Role $role)
    {
        $role->delete();
        return response()->json(['message' => 'Role deleted successfully']);
    }

}
