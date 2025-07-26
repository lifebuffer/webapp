import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '~/utils/auth'
import { RequireAuth } from '~/components/RequireAuth'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { logout } = useAuth()
  
  return (
    <RequireAuth>
      <div className="p-2">
        <h3>Welcome to LifeBuffer!</h3>
        <div className="mt-4">
          <p className="mb-2">You are logged in.</p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </RequireAuth>
  )
}
