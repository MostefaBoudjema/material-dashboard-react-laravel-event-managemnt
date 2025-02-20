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
        // User::create([
        //     'name' => 'New',
        //     'email' => 'user@jsonapi.com',
        //     'password' => 'secret'
        // ]);
        User::create([
            'name' => 'mustafa',
            'email' => 'mustafaaboudjema@gmail.com',
            'password' => '123456789'
        ]);
        User::create([
            'name' => 'mustafa',
            'email' => 'myreal17@gmail.com',
            'password' => '123456789'
        ]);
    }
}
