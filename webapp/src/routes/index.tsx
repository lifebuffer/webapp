import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '~/components/RequireAuth';
import { useAuth } from '~/utils/auth';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const { logout } = useAuth();

  return (
    <RequireAuth>
      <div className="p-2">
        <h3>Welcome to LifeBuffer!</h3>
        <div className="mt-4">
          <p className="mb-2">You are logged in.</p>
          <button
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </RequireAuth>
  );
}
