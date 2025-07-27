@extends('layouts.auth')

@section('title', 'Create Account')
@section('subtitle', 'Join LifeBuffer and start tracking your life')

@section('content')
<form method="POST" action="{{ route('register') }}">
    @csrf

    {{-- Name Field --}}
    <div class="form-group">
        <label for="name" class="form-label">{{ __('Name') }}</label>
        <input 
            id="name" 
            type="text" 
            name="name" 
            value="{{ old('name') }}" 
            class="form-input"
            required 
            autofocus 
            autocomplete="name"
        >
        @error('name')
            <div class="error-message">{{ $message }}</div>
        @enderror
    </div>

    {{-- Email Field --}}
    <div class="form-group">
        <label for="email" class="form-label">{{ __('Email') }}</label>
        <input 
            id="email" 
            type="email" 
            name="email" 
            value="{{ old('email') }}" 
            class="form-input"
            required 
            autocomplete="email"
        >
        @error('email')
            <div class="error-message">{{ $message }}</div>
        @enderror
    </div>

    {{-- Password Field --}}
    <div class="form-group">
        <label for="password" class="form-label">{{ __('Password') }}</label>
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

    {{-- Terms and Conditions (Optional) --}}
    <div class="form-group">
        <label for="terms" class="checkbox-label">
            <input id="terms" type="checkbox" name="terms" class="form-checkbox" required>
            <span>{{ __('I agree to the Terms of Service and Privacy Policy') }}</span>
        </label>
        @error('terms')
            <div class="error-message">{{ $message }}</div>
        @enderror
    </div>

    {{-- Submit Button --}}
    <div class="form-group">
        <button type="submit" class="btn">
            {{ __('Create Account') }}
        </button>
    </div>

    {{-- Links --}}
    <div class="text-center">
        @if (Route::has('login'))
            <p class="text-normal">
                {{ __('Already have an account?') }}
                <a href="{{ route('login') }}" class="text-link">
                    {{ __('Sign in') }}
                </a>
            </p>
        @endif
    </div>
</form>
@endsection