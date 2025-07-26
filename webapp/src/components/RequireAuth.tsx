import { useEffect } from 'react'
import { useAuth } from '~/utils/auth'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, login } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated && typeof window !== 'undefined') {
      login()
    }
  }, [isAuthenticated, loading, login])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Redirecting to login...</h2>
        </div>
      </div>
    )
  }

  return <>{children}</>
}