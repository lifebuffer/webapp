<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Context>
 */
class ContextFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $emojis = ['💼', '🏠', '📚', '🎯', '💪', '🎵', '🍳', '🚗', '✈️', '📱'];

        return [
            'name' => fake()->words(2, true),
            'icon' => fake()->randomElement($emojis),
        ];
    }
}