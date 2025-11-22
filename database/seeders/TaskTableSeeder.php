<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tasks')->insert([
            [
                'task_id' => 'eb31ce2a-31c5-4e08-a6fc-c4bab43e6ceb',
                'task_name' => 'Task Alpha',
                'task_type' => 'INSTALASI',
                'project_id' => '38961e2e-a32c-4eee-9cb3-2dda2a1e1664',
                'user_id' => 'ENGKDI33',
            ],
            [
                'task_id' => 'a03a8694-9767-4884-aace-c1cb4960f0b3',
                'task_name' => 'Task Delta',
                'task_type' => 'MAINTENANCE',
                'project_id' => '10433c2a-b600-4efb-9171-3362a784092e',
                'user_id' => 'ENGKDI33',
            ],
            [
                'task_id' => '05dab979-c311-4f4e-afe9-665a23e5b157',
                'task_name' => 'Task Delta',
                'task_type' => 'INSTALASI',
                'project_id' => 'ad30fc4e-f3df-4949-9672-5761a2e1dd61',
                'user_id' => 'ENGKDI33',
            ],
        ]);
    }
}
