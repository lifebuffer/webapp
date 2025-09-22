import { Link } from '@tanstack/react-router';

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="space-y-2 p-2">
      <div className="text-muted-foreground">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <p className="flex flex-wrap items-center gap-2">
        <button
          className="rounded bg-primary px-2 py-1 font-black text-sm text-primary-foreground uppercase"
          onClick={() => window.history.back()}
        >
          Go back
        </button>
        <Link
          className="rounded bg-secondary px-2 py-1 font-black text-sm text-secondary-foreground uppercase"
          to="/"
        >
          Start Over
        </Link>
      </p>
    </div>
  );
}
