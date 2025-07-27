<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        // Create default contexts
        $user->contexts()->create([
            'name' => 'Work',
            'icon' => '💼',
        ]);

        $personalContext = $user->contexts()->create([
            'name' => 'Personal',
            'icon' => '🏠',
        ]);

        $user->contexts()->create([
            'name' => 'Family',
            'icon' => '👨‍👩‍👧‍👦',
        ]);

        // Get or create today's day record
        $today = now()->format('Y-m-d');
        $user->days()->firstOrCreate(['date' => $today]);

        // Create welcome activities
        $user->activities()->create([
            'title' => 'Signed up for LifeBuffer',
            'status' => 'done',
            'context_id' => $personalContext->id,
            'date' => $today,
        ]);

        $user->activities()->create([
            'title' => 'Start adding an activity',
            'status' => 'new',
            'context_id' => $personalContext->id,
            'date' => $today,
        ]);
    }

}
