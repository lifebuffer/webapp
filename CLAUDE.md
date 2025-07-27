# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LifeBuffer is a cross-platform life tracking app with:

- **Backend API**: Laravel 12 (PHP 8.2+) - Located in `/api`
- **Frontend Web App**: TanStack Start with React 19 - Located in `/webapp`
- **Key Features**: Activity logging, voice input, AI categorization, flexible reporting

## Essential Commands

Never change any code when the user asks to commit!

### API (Laravel) Development

```bash
# In /api directory
cd api

# Install dependencies
composer install
npm install

# Set up environment
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate
php artisan db:seed  # If seeders exist

# Development server (runs multiple services concurrently)
composer dev
# This runs: server, queue worker, logs (pail), and vite

# Run tests
composer test
# Or directly: php artisan test

# Code formatting
php artisan pint

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Web App (TanStack Start) Development

```bash
# In /webapp directory
cd webapp

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env to add your OAuth client ID

# Development server
pnpm dev

# Build for production
pnpm build

# Type checking
tsc --noEmit

# Start production server
pnpm start
```

## Architecture Overview

### API Architecture (Laravel)

- **MVC Pattern**: Controllers in `app/Http/Controllers`, Models in `app/Models`
- **API Routes**: Define in `routes/api.php` (create if not exists)
- **Database**: Migrations in `database/migrations`, uses SQLite by default
- **Queue System**: Background job processing configured
- **Real-time Logs**: Laravel Pail for development logging

### Web App Architecture (TanStack Start)

- **Routing**: File-based routing in `src/routes/`
- **Components**: Organized in `src/components/`
- **State Management**: Use TanStack Query for server state
- **Styling**: Tailwind CSS v3 (note: not v4 as specified in rules)
- **Type Safety**: Strict TypeScript configuration enabled
- **Environment Variables**: Configured via `.env` file with `VITE_` prefix

## Development Guidelines

### API Development Rules

Follow rules in `/rules/laravel.md`

1. **Controllers**: Keep thin, delegate business logic to services
2. **Models**: Use Eloquent relationships and accessors/mutators
3. **Validation**: Use Form Requests for complex validation
4. **API Responses**: Return consistent JSON structure
5. **Testing**: Write feature and unit tests using Pest

### Frontend Development Rules

1. **Components**: Follow rules in `/rules/react.md`
2. **TypeScript**: Strict mode enabled, avoid `any`
3. **Styling**: Use Tailwind classes with proper organization
4. **Routing**: Leverage TanStack Router's type-safe routing
5. **State**: Prefer server state (TanStack Query) over client state

## Key Implementation Areas

### Authentication (OAuth 2.0 with PKCE)

- **Backend**: Laravel Passport for OAuth server
- **Frontend**: Custom PKCE implementation with SHA-256 fallback for non-HTTPS environments
- **Key Files**:
  - Frontend: `webapp/src/utils/auth.tsx`, `webapp/src/routes/auth.callback.tsx`
  - Backend: OAuth routes handled by Laravel Passport
- **Setup**: Run `sail artisan passport:client --public` to create OAuth clients

### Voice Input & AI Categorization

- Frontend: Implement Web Speech API integration
- Backend: Create endpoints for processing voice transcriptions
- AI Integration: Set up service for categorization logic

### Activity Management

- Models: `Activity`, `Context`, `Category`
- API Endpoints: CRUD operations for activities
- Frontend: Activity list, creation forms, search interface

### Reporting System

- Backend: Report generation service with templates
- Export Formats: Implement CSV, JSON, and formatted text
- Frontend: Report builder interface

## Testing Commands

### API Tests

```bash
cd api
php artisan test
php artisan test --filter=FeatureName
php artisan test --parallel
```

### Frontend Tests

```bash
cd webapp
# Add test runner when configured (Vitest recommended)
```

## Environment Configuration

### API (.env)

Key variables to configure:

- `APP_URL`
- `DB_CONNECTION` (sqlite default)
- `QUEUE_CONNECTION`
- API keys for AI services

### Web App

- Configure API endpoint in environment
- Set up authentication tokens
- Configure feature flags

## Common Tasks

### OAuth Setup

1. Run migrations: `sail artisan migrate`
2. Create OAuth client: `sail artisan passport:client --public --name="App Name" --redirect_uri="http://localhost:3000/auth/callback"`
3. Add the generated client ID to `webapp/.env`:
   ```
   VITE_API_BASE_URL=http://api.lifebuffer.test
   VITE_CLIENT_ID=your-generated-client-id
   ```
4. For multiple domains, update redirect URIs:
   ```php
   sail artisan tinker --execute="\\Laravel\\Passport\\Client::find('client-id')->update(['redirect_uris' => json_encode(['http://localhost:3000/auth/callback', 'http://app.lifebuffer.test/auth/callback'])])"
   ```

### Adding New API Endpoint

1. Create controller: `sail artisan make:controller NameController`
2. Define routes in `routes/api.php`
3. Create request validation: `sail artisan make:request NameRequest`
4. Write tests in `tests/Feature/`

### Adding New Frontend Route

1. Create file in `src/routes/`
2. Export route component
3. Type-safe params automatically inferred
4. Add navigation links as needed

### Database Changes

1. Create migration: `sail artisan make:migration create_table_name`
2. Define schema changes
3. Run: `sail artisan migrate`
4. Update models and relationships

## Performance Considerations

- Use database indexing for frequently queried fields
- Implement caching for expensive operations
- Use queue jobs for time-consuming tasks
- Optimize frontend bundle with code splitting

## Security Notes

- API authentication setup required
- CORS configuration in `config/cors.php`
- Rate limiting configured in `routes/api.php`
- Input validation on all user data
- XSS protection via React's default escaping
