<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'Laravel') }} - Authorization Request</title>

    {{-- Copied Styles from login.blade.php --}}
    <style>
        body {
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f3f4f6;
            margin: 0;
        }

        /* Added margin: 0 */
        .authorize-card {
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 500px;
        }

        /* Renamed class, increased max-width */
        .form-group {
            margin-bottom: 1rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }

        input[type="email"],
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            box-sizing: border-box;
        }

        input[type="checkbox"] {
            margin-right: 0.5rem;
        }

        button {
            background-color: #4f46e5;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 1rem;
        }

        button:hover {
            background-color: #4338ca;
        }

        .error-message {
            color: #dc2626;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }

        .alert-danger ul {
            list-style: none;
            padding: 0;
            margin: 1rem 0 0 0;
        }

        .alert-danger li {
            color: #dc2626;
        }

        /* Added styles for Passport elements */
        .scopes {
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .scopes p {
            margin-bottom: 0.5rem;
        }

        .scopes ul {
            list-style: disc;
            padding-left: 1.5rem;
            margin: 0;
        }

        .scopes li {
            margin-bottom: 0.25rem;
        }

        .buttons {
            margin-top: 1.5rem;
            text-align: center;
        }

        .buttons form {
            display: inline-block;
        }

        /* Use inline-block for forms */
        .buttons button {
            min-width: 120px;
        }

        /* Ensure buttons have minimum width */
        .btn-approve {
            background-color: #10b981;
            margin-right: 1rem;
        }

        /* Green approve */
        .btn-approve:hover {
            background-color: #059669;
        }

        .btn-deny {
            background-color: #ef4444;
        }

        /* Red deny */
        .btn-deny:hover {
            background-color: #dc2626;
        }
    </style>
</head>

<body> {{-- Removed passport-authorize class --}}
    <div class="authorize-card"> {{-- Replaced structure with a single card --}}
        <h2>Authorization Request</h2>

        <!-- Introduction -->
        <p><strong>{{ $client->name }}</strong> is requesting permission to access your account.</p>

        <!-- Scope List -->
        @if (count($scopes) > 0)
            <div class="scopes">
                <p><strong>This application will be able to:</strong></p>
                <ul>
                    @foreach ($scopes as $scope)
                        <li>{{ $scope->description }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div class="buttons">
            <!-- Authorize Button -->
            <form method="post" action="{{ route('passport.authorizations.approve') }}">
                @csrf
                <input type="hidden" name="state" value="{{ $request->state }}">
                <input type="hidden" name="client_id" value="{{ $client->getKey() }}">
                <input type="hidden" name="auth_token" value="{{ $authToken }}">
                <button type="submit" class="btn-approve">Authorize</button> {{-- Removed btn and btn-success --}}
            </form>

            <!-- Cancel Button -->
            <form method="post" action="{{ route('passport.authorizations.deny') }}">
                @csrf
                @method('DELETE')
                <input type="hidden" name="state" value="{{ $request->state }}">
                <input type="hidden" name="client_id" value="{{ $client->getKey() }}">
                <input type="hidden" name="auth_token" value="{{ $authToken }}">
                <button type="submit" class="btn-deny">Deny</button> {{-- Renamed from Cancel, removed btn and btn-danger --}}
            </form>
        </div>
    </div> {{-- End authorize-card --}}
</body>

</html>
