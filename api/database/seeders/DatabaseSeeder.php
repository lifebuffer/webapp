<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Laravel\Passport\Client;

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

        Client::create([
            'id' => '9ebd8f82-e3fe-4205-87ad-bfe10e03cdd9',
            'name' => 'lifebuffer.test',
            'secret' => null,
            'redirect_uris' => ['http://localhost:3000/auth/callback', 'http://app.lifebuffer.test:3000/auth/callback'],
            'grant_types' => ['authorization_code','refresh_token'],
            'revoked' => false,
        ]);

        User::factory(10)->create();

        $this->call([
            ActivitiesSeeder::class,
            DaysSeeder::class,
            ContextSeeder::class,
        ]);
    }
}
