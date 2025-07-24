<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Activity>
 */
class ActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'title' => fake()->sentence(6, true),
            'notes' => fake()->boolean(20) ? fake()->paragraphs(1, true) : null,
            'status' => fake()->randomElement(['new', 'in_progress', 'done']),
            'time' => fake()->boolean(50) ? rand(10, 180) : null
        ];
    }
}
