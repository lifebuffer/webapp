# LifeBuffer

A flexible life tracking app that helps professionals capture, organize, and recall their daily activities with minimal friction.

## Overview

LifeBuffer is designed for knowledge workers who need to track accomplishments for 1-on-1s, standups, and performance reviews. Unlike complex productivity systems, LifeBuffer emphasizes simplicity and AI augmentation to make activity tracking effortless.

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: TanStack Start with React 19
- **Landing Page**: React 19 with Vite and Tailwind CSS v4
- **Database**: PostgreSQL (production), SQLite (development)
- **Deployment**: Upsun cloud platform
- **Styling**: Tailwind CSS

## Quick Start

### Prerequisites

- PHP 8.2+
- Node.js 18+
- Composer
- pnpm

### Backend Setup

```bash
cd api
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
composer dev
```

### Frontend Setup

```bash
cd webapp
pnpm install
pnpm dev
```

## Features

### ✅ Implemented Features

- **Activity Management**: Complete CRUD operations with auto-save functionality
  - Create activities via "New activity" button or keyboard shortcut ('c')
  - Real-time editing with auto-save on blur
  - Status management (new, in progress, done)
  - Time tracking with smart parsing (e.g., "2h 30m")
- **Context Organization**: Create and filter activities by context with emoji support
- **Day Notes**: Markdown-enabled notes with live preview and editing
- **Date Navigation**: Smart date selection with intelligent caching
- **Keyboard Shortcuts**: Streamlined workflow with customizable shortcuts
- **Voice Input**: Complete AI-powered voice recording with intelligent processing
  - Press 't' to start voice recording with real-time audio visualization
  - OpenAI Whisper integration for speech-to-text transcription
  - GPT-4o-mini for intelligent title and notes extraction
  - Automatic activity creation with success notifications
- **Security**: Laravel policies and OAuth authentication with PKCE
- **Real-Time Updates**: Automatic cache management and state synchronization
- **Comprehensive Testing**: Full API test coverage with Pest framework

### 🚧 Planned Features

- **AI Categorization**: Smart activity organization and suggestions
- **Flexible Reporting**: Export activities to multiple formats (CSV, JSON, PDF)
- **Mobile Support**: Progressive web app capabilities
- **Team Features**: Shared contexts and collaborative tracking

## Testing

### API Tests

The backend uses **Pest** testing framework for comprehensive API testing:

```bash
cd api

# Run all tests
php artisan test

# Run specific test suite
php artisan test --filter=ActivityTest

# Run with testing environment (faster, uses in-memory SQLite)
php artisan test --env=testing
```

**Test Coverage:**
- Activity CRUD operations with validation
- Voice recording API with OpenAI integration testing
- User authorization and security policies
- Context relationships and permissions
- Complete API endpoint testing

### Frontend Tests

Type checking is available for the frontend:

```bash
cd webapp
tsc --noEmit
```

## Project Structure

LifeBuffer is organized as a monorepo with three main applications:

- **`/api`** - Laravel backend API with OAuth authentication and OpenAI integration
- **`/webapp`** - React frontend application built with TanStack Start
- **`/landing`** - Marketing landing page built with React and Vite

## Deployment

### Upsun Cloud Platform

LifeBuffer is deployed on [Upsun](https://upsun.com), a modern Platform-as-a-Service that provides:

- **Multi-app orchestration**: API, webapp, and landing page deployed together
- **Managed services**: PostgreSQL database and Redis cache
- **Auto-scaling**: Containers scale based on demand
- **SSL certificates**: Automatic HTTPS for all domains
- **Branch deployments**: Each Git branch gets its own environment

#### Production URLs
- **Landing Page**: `https://lifebuffer.com` (marketing site)
- **Web App**: `https://app.lifebuffer.com` (main application)
- **API**: `https://api.lifebuffer.com` (backend services)

#### Deployment Configuration

The deployment is managed by `.upsun/config.yaml` which defines:

```yaml
applications:
  api:          # Laravel backend (PHP 8.4)
  webapp:       # React frontend (Node.js 22)
  landing:      # Marketing site (Node.js 22)

services:
  postgresql:   # Database (PostgreSQL 17)
  redis:        # Cache and sessions (Redis 7.0)

routes:
  # Automatic HTTPS with domain routing
```

#### Environment Variables

Production configuration uses Upsun's environment variables:
- Database connection via `$DATABASE_*` variables
- Redis connection via `$REDIS_*` variables
- Session domain automatically configured
- HTTPS enforced with secure cookies

#### Deployment Process

1. **Push to Git**: Changes trigger automatic deployment
2. **Build Phase**: Each app builds in parallel (Composer, NPM, PNPM)
3. **Deploy Phase**: Database migrations and optimization
4. **Health Checks**: Automatic verification before routing traffic

### Local Development vs Production

| Aspect | Local Development | Production (Upsun) |
|--------|------------------|-------------------|
| Database | SQLite | PostgreSQL 17 |
| Sessions | File storage | Redis 7.0 |
| HTTPS | HTTP only | Enforced HTTPS |
| Domain | `.test` domains | Production domains |
| Environment | Laravel Sail | Upsun containers |

## Development

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines and [PRODUCT_SPECS.md](./PRODUCT_SPECS.md) for full product specifications.

For the landing page specifically, see [landing/README.md](./landing/README.md) for setup and development instructions.

## License

Private project - All rights reserved