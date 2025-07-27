<?php

namespace App\Policies;

use App\Models\Context;
use App\Models\User;

class ContextPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Context $context): bool
    {
        return $user->id === $context->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Context $context): bool
    {
        return $user->id === $context->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Context $context): bool
    {
        return $user->id === $context->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Context $context): bool
    {
        return $user->id === $context->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Context $context): bool
    {
        return $user->id === $context->user_id;
    }
}
