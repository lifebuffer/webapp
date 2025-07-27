@extends('layouts.auth')

@section('title', 'Reset Password')
@section('subtitle', 'Enter your new password')

@section('content')
<form method="POST" action="{{ route('password.update') }}">
    @csrf

    <!-- Password Reset Token -->
    <input type="hidden" name="token" value="{{ $request->route('token') }}">

    {{-- Email Field --}}
    <div class="form-group">
        <label for="email" class="form-label">{{ __('Email') }}</label>
        <input 
            id="email" 
            type="email" 
            name="email" 
            value="{{ old('email', $request->email) }}" 
            class="form-input"
            required 
            autofocus 
            autocomplete="email"
        >
        @error('email')
            <div class="error-message">{{ $message }}</div>
        @enderror
    </div>

    {{-- Password Field --}}
    <div class="form-group">
        <label for="password" class="form-label">{{ __('New Password') }}</label>
        <input 
            id="password" 
            type="password" 
            name="password" 
            class="form-input"
            required 
            autocomplete="new-password"
        >
        @error('password')
            <div class="error-message">{{ $message }}</div>
        @enderror
    </div>

    {{-- Confirm Password Field --}}
    <div class="form-group">
        <label for="password_confirmation" class="form-label">{{ __('Confirm Password') }}</label>
        <input 
            id="password_confirmation" 
            type="password" 
            name="password_confirmation" 
            class="form-input"
            required 
            autocomplete="new-password"
        >
        @error('password_confirmation')
            <div class="error-message">{{ $message }}</div>
        @enderror
    </div>

    {{-- Submit Button --}}
    <div class="form-group">
        <button type="submit" class="btn">
            {{ __('Reset Password') }}
        </button>
    </div>

    {{-- Links --}}
    <div class="text-center">
        @if (Route::has('login'))
            <p class="text-normal">
                {{ __('Remember your password?') }}
                <a href="{{ route('login') }}" class="text-link">
                    {{ __('Sign in') }}
                </a>
            </p>
        @endif
    </div>
</form>
@endsection