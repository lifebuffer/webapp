<?php

namespace Database\Seeders;

use App\Models\Context;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContextSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultContexts = [
            ['name' => 'Work', 'icon' => '💼'],
            ['name' => 'Personal', 'icon' => '🏠'],
            ['name' => 'Family', 'icon' => '👨‍👩‍👧‍👦'],
        ];

        // Get all users and create default contexts for each
        User::all()->each(function (User $user) use ($defaultContexts) {
            foreach ($defaultContexts as $contextData) {
                // Only create if the context doesn't already exist for this user
                $user->contexts()->firstOrCreate(
                    ['name' => $contextData['name']],
                    ['icon' => $contextData['icon']]
                );
            }
        });
    }
}
