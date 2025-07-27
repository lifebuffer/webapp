@extends('layouts.auth')

@section('title', 'Sign In')
@section('subtitle', 'Welcome back to LifeBuffer')

@section('content')
<form method="POST" action="{{ route('login') }}">
    @csrf

    {{-- Email / Username Field --}}
    @php
        $username_field = config('fortify.username', 'email');
        $username_label = $username_field === 'username' ? __('Username') : __('Email');
        $username_type = $username_field === 'username' ? 'text' : 'email';
    @endphp
    <div class="form-group">
        <label for="{{ $username_field }}" class="form-label">{{ $username_label }}</label>
        <input 
            id="{{ $username_field }}" 
            type="{{ $username_type }}" 
            name="{{ $username_field }}" 
            value="{{ old($username_field) }}" 
            class="form-input"
            required 
            autofocus 
            autocomplete="{{ $username_field }}"
        >
        @error($username_field)
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
            autocomplete="current-password"
        >
        @error('password')
            <div class="error-message">{{ $message }}</div>
        @enderror
    </div>

    {{-- Remember Me Checkbox --}}
    <div class="form-group">
        <label for="remember" class="checkbox-label">
            <input id="remember" type="checkbox" name="remember" class="form-checkbox">
            <span>{{ __('Remember me') }}</span>
        </label>
    </div>

    {{-- Submit Button --}}
    <div class="form-group">
        <button type="submit" class="btn">
            {{ __('Sign In') }}
        </button>
    </div>

    {{-- Links --}}
    <div class="flex justify-between items-center text-center">
        @if (Route::has('password.request'))
            <a href="{{ route('password.request') }}" class="text-link">
                {{ __('Forgot your password?') }}
            </a>
        @endif
        
        @if (Route::has('register'))
            <a href="{{ route('register') }}" class="text-link">
                {{ __('Create account') }}
            </a>
        @endif
    </div>
</form>
@endsection
