import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '~/utils/auth'
import { authConfig } from '~/config/auth'

const { apiBaseUrl: API_BASE_URL, clientId: CLIENT_ID } = authConfig

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const { setTokens } = useAuth()
  
  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const state = params.get('state')
      const error = params.get('error')
      
      if (error) {
        console.error('Authentication error:', error)
        const errorDescription = params.get('error_description')
        if (errorDescription) {
          console.error('Error description:', errorDescription)
        }
        window.location.href = '/'
        return
      }
      
      // Verify state matches
      const storedState = sessionStorage.getItem('oauth_state')
      if (!state || state !== storedState) {
        console.error('State mismatch - possible CSRF attack')
        window.location.href = '/'
        return
      }
      
      // Get stored code verifier
      const codeVerifier = sessionStorage.getItem('oauth_code_verifier')
      if (!code || !codeVerifier) {
        console.error('Missing authorization code or code verifier')
        window.location.href = '/'
        return
      }
      
      try {
        // Exchange authorization code for tokens
        const tokenResponse = await fetch(`${API_BASE_URL}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            redirect_uri: window.location.origin + '/auth/callback',
            code_verifier: codeVerifier,
            code: code,
          }),
        })
        
        if (!tokenResponse.ok) {
          throw new Error('Token exchange failed')
        }
        
        const tokenData = await tokenResponse.json()
        
        if (tokenData.access_token && tokenData.refresh_token) {
          setTokens(tokenData.access_token, tokenData.refresh_token)
          
          // Clean up session storage
          sessionStorage.removeItem('oauth_state')
          sessionStorage.removeItem('oauth_code_verifier')
          
          window.location.href = '/'
        } else {
          throw new Error('Invalid token response')
        }
      } catch (error) {
        console.error('Token exchange error:', error)
        window.location.href = '/'
      }
    }
    
    handleCallback()
  }, [setTokens])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Authenticating...</h2>
        <p className="text-gray-600">Please wait while we complete your login.</p>
      </div>
    </div>
  )
}