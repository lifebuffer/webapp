<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Day>
 */
class DayFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $isFilled = fake()->boolean(66);

        return [
            'notes' => $isFilled ? fake()->paragraphs(2, true) : null,
            'summary' => $isFilled ? fake()->sentences(1, true) : null,
        ];
    }
}
