<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('users')->truncate();
        Schema::enableForeignKeyConstraints();

        User::create([
            'name' => 'Admin',
            'email' => 'admin@jsonapi.com',
            'password' => 'secret'
        ]);
        User::create([
            'name' => 'New',
            'email' => 'user1@jsonapi.com',
            'password' => 'secret'
        ]);
        User::create([
            'name' => 'New',
            'email' => 'user2@jsonapi.com',
            'password' => 'secret'
        ]);
    }
}
