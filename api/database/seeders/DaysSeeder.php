<?php

namespace Database\Seeders;

use App\Models\Day;
use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DaysSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach(User::all() as $user) {
            $today = Carbon::today();
            // echo "Date: " . $today->format('Y-m-d')."\r\n";
            for($i = 0; $i < 90; $i++) {
                $today->subDay();

                if(rand(0, 10) > 5) {
                    Day::factory()->create([
                        'date' => $today->format('Y-m-d'),
                        'user_id' => $user->id
                    ]);
                }
            }
        }
    }
}
