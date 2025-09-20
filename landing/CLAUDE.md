# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LifeBuffer Landing is a marketing website for LifeBuffer - a flexible life tracking app designed to help professionals capture, organize, and recall their daily activities with minimal friction. This is a React-based landing page built with modern web technologies to showcase the product's features and drive user adoption.

**Product Context**: LifeBuffer emphasizes flexibility and AI augmentation to make activity tracking effortless and valuable for busy professionals. Unlike complex productivity systems that become burdensome to maintain, LifeBuffer focuses on helping professionals remember and report what they've accomplished. Target users include individual contributors, knowledge workers, consultants, project managers, and organization-minded professionals.

## Technology Stack

- **React 19+** with TypeScript and functional components
- **Vite** for build tooling and development server  
- **Tailwind CSS v4** for styling with utility-first approach
- **Shadcn/ui** component library for consistent UI components
- **Lucide React** for icons
- **PNPM** as package manager (locked to v9.11.0)

## Development Commands

```bash
# Development
pnpm dev          # Start development server with HMR
pnpm build        # TypeScript compilation + production build
pnpm preview      # Preview production build locally
pnpm lint         # Run ESLint checks

# Package management
pnpm install      # Install dependencies (respects lockfile)
```

## Project Structure

```
src/
├── components/   # React components (none yet - will follow Shadcn/ui patterns)
├── lib/          # Utility functions (cn utility for class merging)
├── App.tsx       # Main application component
├── main.tsx      # React application entry point
└── index.css     # Global styles and Tailwind imports
```

## Key Architectural Decisions

### Component Patterns
- **Functional components only** with React hooks
- **TypeScript strict mode** enabled for maximum type safety
- **Shadcn/ui integration** for consistent component library
- Path alias `@/` configured for clean imports (`@/lib/utils`, `@/components/ui`)

### Styling Strategy
- **Tailwind CSS v4** with utility-first approach
- `cn()` utility function from `@/lib/utils.ts` for conditional class merging
- Class organization: layout → spacing → sizing → typography → colors → effects → interactions → responsive → dark mode

### Code Quality Rules
The project follows strict development rules defined in `rules/`:

- **React rules** (`rules/react.md`): Comprehensive TypeScript + React + Tailwind guidelines
- **Ultracite rules** (`rules/ultracite.md`): AI-ready formatter and linter rules for accessibility, performance, and code quality

### Key Conventions
- Use `interface` for object shapes, `type` for unions/intersections
- No `any` types - use `unknown` if type is truly unknown
- Components in PascalCase, hooks with `use` prefix, utilities in camelCase
- Export types separately from components
- Always use the `cn()` utility for dynamic className composition

## Component Development

When creating new components:

1. **Follow Shadcn/ui patterns** - install components with `npx shadcn@latest add [component]`
2. **Customize after installation** - store in `@/components/ui/`
3. **Use CVA (Class Variance Authority)** for variant-based styling
4. **Include proper TypeScript interfaces** for all props
5. **Support forwarded refs** when applicable

Example component structure:
```typescript
interface ComponentProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({ 
  variant, 
  size = 'md', 
  children 
}) => {
  return (
    <div className={cn(
      "base classes",
      variant === 'primary' && "primary classes",
      variant === 'secondary' && "secondary classes"
    )}>
      {children}
    </div>
  );
};
```

## Marketing Site Requirements

This landing page should effectively communicate LifeBuffer's value proposition:

### Core Features to Highlight
1. **Friction-Free Capture** - Voice input and simple logging that doesn't interrupt workflow
2. **AI-Powered Organization** - Smart categorization and insights without manual setup
3. **Flexible Context System** - No rigid frameworks, adapts to your workflow
4. **Professional Reporting** - Multiple export formats for meetings and reviews
5. **Cross-Platform Sync** - Real-time data synchronization across devices

### Target Audience Messaging
- **Individual Contributors**: Never walk into a 1-on-1 empty-handed again
- **Knowledge Workers**: Professional tracking without productivity overhead
- **Consultants & Freelancers**: Professional reporting for the self-directed
- **Project Managers**: Track leadership impact beyond the tools

### Key Features (Current Implementation)
Focus messaging on: Activity logging with voice input, daily organization with markdown notes, flexible context filtering, search and discovery, and professional reporting and export capabilities.

## Performance Considerations

- **Code splitting** with React.lazy for heavy components
- **Memoization** with React.memo, useMemo, useCallback when appropriate
- **Image optimization** for product screenshots and hero images
- **Bundle analysis** to maintain fast loading times
- **Web Vitals monitoring** for LCP, FID, CLS metrics

## Accessibility Requirements

Follow WCAG 2.1 AA compliance:
- Semantic HTML elements first, ARIA attributes when needed
- Keyboard navigation throughout the interface
- Screen reader compatibility
- High contrast mode support
- Meaningful alt text for all images
- Focus management and indicators

## Build and Deployment Notes

- **TypeScript strict mode** - all type errors must be resolved before build
- **ESLint configuration** - follows recommended TypeScript and React rules
- **Production build** - `pnpm build` creates optimized bundle in `dist/`
- **Vite HMR** - Fast refresh during development
- **Path resolution** - `@/` alias configured for clean imports

When working on this project, always check both the React rules and Ultracite rules for specific coding standards and patterns to follow.