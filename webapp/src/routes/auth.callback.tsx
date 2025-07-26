import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '~/utils/auth'
import { authConfig } from '~/config/auth'

const { apiBaseUrl: API_BASE_URL, clientId: CLIENT_ID, clientSecret: CLIENT_SECRET } = authConfig

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
      } else {
        console.log('Code:', code)
        console.log('Code verifier:', codeVerifier)
      }
      
      try {
        console.log('Exchanging code for tokens...')
        console.log('Code:', code)
        console.log('Client ID:', CLIENT_ID)
        console.log('Redirect URI:', window.location.origin + '/auth/callback')
        
        // Build form data for token exchange
        const formData = new URLSearchParams()
        formData.append('grant_type', 'authorization_code')
        formData.append('client_id', CLIENT_ID)
        formData.append('redirect_uri', window.location.origin + '/auth/callback')
        formData.append('code_verifier', codeVerifier)
        formData.append('code', code)
        
        console.log('Token request body:', formData.toString())
        
        // Exchange authorization code for tokens
        const tokenResponse = await fetch(`${API_BASE_URL}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: formData.toString(),
        })
        
        console.log('Token response status:', tokenResponse.status)
        const responseText = await tokenResponse.text()
        console.log('Token response:', responseText)
        
        if (!tokenResponse.ok) {
          throw new Error(`Token exchange failed: ${responseText}`)
        }
        
        const tokenData = JSON.parse(responseText)
        console.log('Parsed token data:', tokenData)
        
        if (tokenData.access_token) {
          // Handle both cases: with and without refresh token
          const refreshToken = tokenData.refresh_token || ''
          console.log('Setting tokens...')
          setTokens(tokenData.access_token, refreshToken)
          
          // Clean up session storage
          sessionStorage.removeItem('oauth_state')
          sessionStorage.removeItem('oauth_code_verifier')
          
          console.log('Redirecting to home...')
          window.location.href = '/'
        } else {
          throw new Error('No access token in response')
        }
      } catch (error) {
        console.error('Token exchange error:', error)
        // Don't redirect immediately to avoid loop
        setTimeout(() => {
          window.location.href = '/'
        }, 10000)
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