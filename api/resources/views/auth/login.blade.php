<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login</title>
    {{-- Add basic styling or link to your CSS --}}
    <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f3f4f6; }
        .login-card { background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
        input[type="email"], input[type="text"], input[type="password"] { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; box-sizing: border-box; }
        input[type="checkbox"] { margin-right: 0.5rem; }
        button { background-color: #4f46e5; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 1rem; }
        button:hover { background-color: #4338ca; }
        .error-message { color: #dc2626; font-size: 0.875rem; margin-top: 0.25rem; }
        .alert-danger ul { list-style: none; padding: 0; margin: 1rem 0 0 0; }
        .alert-danger li { color: #dc2626; }
    </style>
</head>
<body>
    <div class="login-card">
        <h2>Login</h2>

        {{-- Session Status --}}
        @if (session('status'))
            <div class="mb-4 font-medium text-sm text-green-600">
                {{ session('status') }}
            </div>
        @endif

        {{-- Validation Errors --}}
        @if ($errors->any())
            <div class="alert alert-danger">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}">
            @csrf

            {{-- Email / Username Field --}}
            @php
                $username_field = config('fortify.username', 'email');
                $username_label = $username_field === 'username' ? __('Username') : __('Email');
                $username_type = $username_field === 'username' ? 'text' : 'email';
            @endphp
            <div class="form-group">
                <label for="{{ $username_field }}">{{ $username_label }}</label>
                <input id="{{ $username_field }}" type="{{ $username_type }}" name="{{ $username_field }}" value="{{ old($username_field) }}" required autofocus autocomplete="{{ $username_field }}">
                @error($username_field)
                    <span class="error-message">{{ $message }}</span>
                @enderror
            </div>

            {{-- Password Field --}}
            <div class="form-group">
                <label for="password">{{ __('Password') }}</label>
                <input id="password" type="password" name="password" required autocomplete="current-password">
                @error('password')
                    <span class="error-message">{{ $message }}</span>
                @enderror
            </div>

            {{-- Remember Me Checkbox --}}
            <div class="form-group">
                <label for="remember">
                    <input id="remember" type="checkbox" name="remember">
                    <span>{{ __('Remember me') }}</span>
                </label>
            </div>

            {{-- Submit Button --}}
            <div style="text-align: right;">
                @if (Route::has('password.request'))
                    <a style="font-size: 0.875rem; color: #6b7280; margin-right: 1rem; text-decoration: none;" href="{{ route('password.request') }}">
                        {{ __('Forgot your password?') }}
                    </a>
                @endif

                <button type="submit">
                    {{ __('Log in') }}
                </button>
            </div>
        </form>
    </div>
</body>
</html>
