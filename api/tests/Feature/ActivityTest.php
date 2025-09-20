<?php

use App\Models\Activity;
use App\Models\Context;
use App\Models\Day;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    Passport::actingAs($this->user);
});

describe('Activity API', function () {

    describe('POST /api/activities', function () {

        it('can create a new activity', function () {
            $data = [
                'title' => 'Test Activity',
                'notes' => 'This is a test note',
                'status' => 'new',
                'time' => 60,
                'date' => '2025-01-15',
            ];

            $response = $this->postJson('/api/activities', $data);

            $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'title',
                    'notes',
                    'status',
                    'time',
                    'date',
                    'user_id',
                    'created_at',
                    'updated_at',
                    'context'
                ]);

            $this->assertDatabaseHas('activities', [
                'title' => 'Test Activity',
                'notes' => 'This is a test note',
                'status' => 'new',
                'time' => 60,
                'date' => '2025-01-15',
                'user_id' => $this->user->id,
            ]);

            // Check that a Day record was created
            $this->assertDatabaseHas('days', [
                'date' => '2025-01-15',
                'user_id' => $this->user->id,
            ]);
        });

        it('can create an activity with a context', function () {
            $context = Context::factory()->for($this->user)->create();

            $data = [
                'title' => 'Context Activity',
                'status' => 'in_progress',
                'context_id' => $context->id,
                'date' => '2025-01-15',
            ];

            $response = $this->postJson('/api/activities', $data);

            $response->assertStatus(201)
                ->assertJson([
                    'title' => 'Context Activity',
                    'context_id' => $context->id,
                    'context' => [
                        'id' => $context->id,
                        'name' => $context->name,
                        'icon' => $context->icon,
                    ]
                ]);
        });

        it('can create an activity with minimal data', function () {
            $data = [
                'title' => 'Minimal Activity',
                'status' => 'new',
                'date' => '2025-01-15',
            ];

            $response = $this->postJson('/api/activities', $data);

            $response->assertStatus(201);

            $this->assertDatabaseHas('activities', [
                'title' => 'Minimal Activity',
                'notes' => null,
                'time' => null,
                'context_id' => null,
            ]);
        });

        it('validates required fields', function () {
            $response = $this->postJson('/api/activities', []);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['title', 'status', 'date']);
        });

        it('validates title field', function () {
            $data = [
                'title' => '', // Empty title
                'status' => 'new',
                'date' => '2025-01-15',
            ];

            $response = $this->postJson('/api/activities', $data);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['title']);
        });

        it('validates status field', function () {
            $data = [
                'title' => 'Test Activity',
                'status' => 'invalid_status',
                'date' => '2025-01-15',
            ];

            $response = $this->postJson('/api/activities', $data);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['status']);
        });

        it('validates date field format', function () {
            $data = [
                'title' => 'Test Activity',
                'status' => 'new',
                'date' => 'invalid-date',
            ];

            $response = $this->postJson('/api/activities', $data);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['date']);
        });

        it('validates time field is integer', function () {
            $data = [
                'title' => 'Test Activity',
                'status' => 'new',
                'date' => '2025-01-15',
                'time' => 'not-a-number',
            ];

            $response = $this->postJson('/api/activities', $data);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['time']);
        });

        it('validates time field is not negative', function () {
            $data = [
                'title' => 'Test Activity',
                'status' => 'new',
                'date' => '2025-01-15',
                'time' => -10,
            ];

            $response = $this->postJson('/api/activities', $data);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['time']);
        });

        it('validates context belongs to user', function () {
            $otherUser = User::factory()->create();
            $otherContext = Context::factory()->for($otherUser)->create();

            $data = [
                'title' => 'Test Activity',
                'status' => 'new',
                'date' => '2025-01-15',
                'context_id' => $otherContext->id,
            ];

            $response = $this->postJson('/api/activities', $data);

            $response->assertStatus(404)
                ->assertJson(['error' => 'Context not found']);
        });

        it('rejects non-existent context', function () {
            $data = [
                'title' => 'Test Activity',
                'status' => 'new',
                'date' => '2025-01-15',
                'context_id' => 999999,
            ];

            $response = $this->postJson('/api/activities', $data);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['context_id']);
        });

        it('requires authentication', function () {
            // Clear the authentication
            $this->app['auth']->forgetGuards();

            $data = [
                'title' => 'Test Activity',
                'status' => 'new',
                'date' => '2025-01-15',
            ];

            $response = $this->postJson('/api/activities', $data);

            $response->assertStatus(401);
        });
    });

    describe('PUT /api/activities/{id}', function () {

        it('can update an activity', function () {
            $activity = Activity::factory()
                ->for($this->user)
                ->create([
                    'title' => 'Original Title',
                    'status' => 'new',
                    'date' => '2025-01-15',
                ]);

            $updateData = [
                'title' => 'Updated Title',
                'status' => 'done',
                'notes' => 'Added some notes',
                'time' => 120,
            ];

            $response = $this->putJson("/api/activities/{$activity->id}", $updateData);

            $response->assertStatus(200)
                ->assertJson([
                    'id' => $activity->id,
                    'title' => 'Updated Title',
                    'status' => 'done',
                    'notes' => 'Added some notes',
                    'time' => 120,
                ]);

            $this->assertDatabaseHas('activities', [
                'id' => $activity->id,
                'title' => 'Updated Title',
                'status' => 'done',
                'notes' => 'Added some notes',
                'time' => 120,
            ]);
        });

        it('can update activity with context', function () {
            $context = Context::factory()->for($this->user)->create();
            $activity = Activity::factory()
                ->for($this->user)
                ->create(['date' => '2025-01-15']);

            $response = $this->putJson("/api/activities/{$activity->id}", [
                'context_id' => $context->id,
            ]);

            $response->assertStatus(200)
                ->assertJson([
                    'context_id' => $context->id,
                    'context' => [
                        'id' => $context->id,
                        'name' => $context->name,
                    ]
                ]);
        });

        it('can remove context from activity', function () {
            $context = Context::factory()->for($this->user)->create();
            $activity = Activity::factory()
                ->for($this->user)
                ->for($context)
                ->create(['date' => '2025-01-15']);

            $response = $this->putJson("/api/activities/{$activity->id}", [
                'context_id' => null,
            ]);

            $response->assertStatus(200)
                ->assertJson([
                    'context_id' => null,
                    'context' => null,
                ]);
        });

        it('prevents updating activity of other users', function () {
            $otherUser = User::factory()->create();
            $activity = Activity::factory()
                ->for($otherUser)
                ->create(['date' => '2025-01-15']);

            $response = $this->putJson("/api/activities/{$activity->id}", [
                'title' => 'Hacked Title',
            ]);

            $response->assertStatus(403);
        });

        it('validates update data', function () {
            $activity = Activity::factory()
                ->for($this->user)
                ->create(['date' => '2025-01-15']);

            $response = $this->putJson("/api/activities/{$activity->id}", [
                'status' => 'invalid_status',
                'time' => -10,
            ]);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['status', 'time']);
        });

        it('returns 404 for non-existent activity', function () {
            $response = $this->putJson('/api/activities/non-existent-id', [
                'title' => 'Updated Title',
            ]);

            $response->assertStatus(404);
        });
    });

    describe('DELETE /api/activities/{id}', function () {

        it('can delete an activity', function () {
            $activity = Activity::factory()
                ->for($this->user)
                ->create(['date' => '2025-01-15']);

            $response = $this->deleteJson("/api/activities/{$activity->id}");

            $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Activity deleted successfully'
                ]);

            $this->assertSoftDeleted('activities', [
                'id' => $activity->id,
            ]);
        });

        it('prevents deleting activity of other users', function () {
            $otherUser = User::factory()->create();
            $activity = Activity::factory()
                ->for($otherUser)
                ->create(['date' => '2025-01-15']);

            $response = $this->deleteJson("/api/activities/{$activity->id}");

            $response->assertStatus(403);
        });

        it('returns 404 for non-existent activity', function () {
            $response = $this->deleteJson('/api/activities/non-existent-id');

            $response->assertStatus(404);
        });
    });
});