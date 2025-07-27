import { useEffect } from 'react';
import { useAuth } from '~/utils/auth';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, login } = useAuth();

  useEffect(() => {
    if (!(loading || isAuthenticated) && typeof window !== 'undefined') {
      login();
    }
  }, [isAuthenticated, loading, login]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-semibold text-2xl">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-semibold text-2xl">
            Redirecting to login...
          </h2>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
