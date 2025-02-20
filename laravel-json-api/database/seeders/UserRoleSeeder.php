<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UserRoleSeeder extends Seeder
{
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('model_has_roles')->truncate();
        $user1 = User::find(1);
        $user1->assignRole('Admin');

        $user2 = User::find(2);
        $user2->assignRole('User');
    }
}
