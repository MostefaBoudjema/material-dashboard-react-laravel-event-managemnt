<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserRoleSeeder extends Seeder
{
    public function run()
    {
        $user1 = User::find(1);
        $user1->assignRole('Admin');

        $user2 = User::find(2);
        $user2->assignRole('User');
    }
}
