@extends('layouts.auth')

@section('title', 'Reset Password')
@section('subtitle', 'Enter your email address and we\'ll send you a reset link')

@section('content')
<form method="POST" action="{{ route('password.email') }}">
    @csrf

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
            autofocus 
            autocomplete="email"
        >
        @error('email')
            <div class="error-message">{{ $message }}</div>
        @enderror
    </div>

    {{-- Submit Button --}}
    <div class="form-group">
        <button type="submit" class="btn">
            {{ __('Send Password Reset Link') }}
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
        
        @if (Route::has('register'))
            <p class="text-normal mt-4">
                {{ __('Don\'t have an account?') }}
                <a href="{{ route('register') }}" class="text-link">
                    {{ __('Create account') }}
                </a>
            </p>
        @endif
    </div>
</form>
@endsection