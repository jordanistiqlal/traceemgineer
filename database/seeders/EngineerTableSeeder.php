<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EngineerTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'user_id' => 'ENGKIE07',
                'name' => 'John Doe',
                'username' => 'johndoe',
                'role' => 'ENGINEER',
                'email' => 'jogndoe@admin.com',
                'nohp' => '0000-0001-0001',
                'password' => Hash::make('12345'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => 'ENGKDI33',
                'name' => 'Jojo Evers',
                'username' => 'jojoevers',
                'role' => 'ENGINEER',
                'email' => 'jojoevers@admin.com',
                'nohp' => '0000-0002-0002',
                'password' => Hash::make('12345'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => 'ENGKDO44',
                'name' => 'Silver Hand',
                'username' => 'silverhand',
                'role' => 'ENGINEER',
                'email' => 'silverhand@admin.com',
                'nohp' => '0000-0003-0003',
                'password' => Hash::make('12345'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
