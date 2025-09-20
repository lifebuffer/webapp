import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { useScrollToTop } from '@/hooks/useScrollToTop';

function RootComponent() {
  useScrollToTop();

  return (
    <>
      <div className="min-h-screen bg-black">
        <Navigation />
        <Outlet />
        <FinalCTA />
        <Footer />
      </div>
      <TanStackRouterDevtools />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
