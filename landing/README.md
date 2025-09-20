# LifeBuffer Landing Page

The marketing website for LifeBuffer - a flexible life tracking app designed to help professionals capture, organize, and recall their daily activities with minimal friction.

## About LifeBuffer

LifeBuffer emphasizes flexibility and AI augmentation to make activity tracking effortless and valuable. Unlike complex productivity systems that become burdensome to maintain, LifeBuffer helps professionals remember and report what they've accomplished without the overhead.

**Target Users:**
- Individual Contributors who struggle to remember accomplishments for 1-on-1s and performance reviews
- Knowledge Workers wanting professional progress tracking without productivity theater
- Consultants & Freelancers needing flexible client work organization and reporting
- Project Managers wanting to document leadership impact beyond traditional tools

## Technology Stack

- **React 19** with TypeScript and functional components
- **Vite** for fast development and optimized builds
- **Tailwind CSS v4** for utility-first styling
- **Shadcn/ui** for consistent component library
- **Lucide React** for icons
- **PNPM** package manager

## Getting Started

### Prerequisites
- Node.js 18+ 
- PNPM 9.11.0+

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint
```

## Development

### Project Structure
```
src/
├── components/   # React components (following Shadcn/ui patterns)
├── lib/          # Utility functions and helpers
├── App.tsx       # Main application component
├── main.tsx      # Application entry point
└── index.css     # Global styles and Tailwind imports
```

### Key Conventions
- Functional components with TypeScript strict mode
- Shadcn/ui component library integration
- Path alias `@/` for clean imports
- `cn()` utility for conditional className composition
- Comprehensive coding rules in `rules/` folder

### Adding Components

Install Shadcn/ui components:
```bash
npx shadcn@latest add [component-name]
```

Components are installed to `src/components/ui/` and can be customized as needed.

## Architecture

This landing page follows modern React patterns with:
- **Type Safety**: Strict TypeScript with no `any` types
- **Performance**: Code splitting and optimization strategies
- **Accessibility**: WCAG 2.1 AA compliance
- **Code Quality**: Ultracite rules for AI-ready development

See `CLAUDE.md` for detailed development guidance and architectural decisions.

## Deployment

The project builds to a static site that can be deployed to any hosting platform:

```bash
pnpm build  # Creates optimized bundle in dist/
```

## Contributing

1. Follow the coding standards defined in `rules/react.md` and `rules/ultracite.md`
2. Ensure TypeScript compilation passes without errors
3. Run linting before committing: `pnpm lint`
4. Components should follow Shadcn/ui patterns and be fully accessible
