# LifeBuffer

A flexible life tracking app that helps professionals capture, organize, and recall their daily activities with minimal friction.

## Overview

LifeBuffer is designed for knowledge workers who need to track accomplishments for 1-on-1s, standups, and performance reviews. Unlike complex productivity systems, LifeBuffer emphasizes simplicity and AI augmentation to make activity tracking effortless.

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: TanStack Start with React 19
- **Database**: SQLite (default)
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
- **Context Organization**: Create and filter activities by context with emoji support
- **Day Notes**: Markdown-enabled notes with live preview and editing
- **Date Navigation**: Smart date selection with intelligent caching
- **Security**: Laravel policies and OAuth authentication with PKCE
- **Real-Time Updates**: Automatic cache management and state synchronization

### 🚧 Planned Features

- **Voice Input**: Web Speech API integration for quick activity logging
- **AI Categorization**: Smart activity organization and suggestions
- **Flexible Reporting**: Export activities to multiple formats (CSV, JSON, PDF)
- **Mobile Support**: Progressive web app capabilities
- **Team Features**: Shared contexts and collaborative tracking

## Development

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines and [PRODUCT_SPECS.md](./PRODUCT_SPECS.md) for full product specifications.

## License

Private project - All rights reserved