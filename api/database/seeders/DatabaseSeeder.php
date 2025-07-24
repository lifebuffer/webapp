<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'G/',
            'email' => 'g@lifebuffer.test',
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@lifebuffer.test',
        ]);

        User::factory(10)->create();

        $this->call([
            ActivitiesSeeder::class,
        ]);
    }
}
