<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TicketTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tickets')->insert([
            [
                'ticket_id' => '60bdaa91-0499-4065-99de-73bd1ffe77a5',
                'ticket_site' => 'Surabaya',
                'ticket_problem' => 'Lorem Ipsum',
                'ticket_tanggal' => '2020-01-01',
                'ticket_jam' => '00.00',
                'ticket_from' => 'ADMKIE07',
                'bodyraw' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                'project_id' => '38961e2e-a32c-4eee-9cb3-2dda2a1e1664',
            ],
            [
                'ticket_id' => 'eda162c0-fe41-45f0-8768-80a5d5221086',
                'ticket_site' => 'Malang',
                'ticket_problem' => 'Lorem Ipsum',
                'ticket_tanggal' => '2024-06-01',
                'ticket_jam' => '00.00',
                'ticket_from' => 'ADMKIE07',
                'bodyraw' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                'project_id' => '38961e2e-a32c-4eee-9cb3-2dda2a1e1664',
            ],
            [
                'ticket_id' => 'd70b634b-7385-4b03-9f7f-994759c26650',
                'ticket_site' => 'Medan',
                'ticket_problem' => 'Lorem Ipsum',
                'ticket_tanggal' => '2025-12-12',
                'ticket_jam' => '00.00',
                'ticket_from' => 'ADMKIE07',
                'bodyraw' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                'project_id' => 'ad30fc4e-f3df-4949-9672-5761a2e1dd61',
            ],
        ]);
    }
}
