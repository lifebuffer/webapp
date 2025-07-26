import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { authConfig } from '~/config/auth'

interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
}

interface AuthContextType extends AuthState {
  login: () => void
  logout: () => void
  setTokens: (accessToken: string, refreshToken: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const { apiBaseUrl: API_BASE_URL, clientId: CLIENT_ID, scopes: SCOPES } = authConfig

// OAuth PKCE helpers
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let text = ''
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)
    const digest = await window.crypto.subtle.digest('SHA-256', data)
    const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)))
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  } else {
    // Fallback for environments without crypto.subtle
    // In production, you might want to use a polyfill or a different approach
    console.warn('crypto.subtle not available, using plain text code challenge')
    return codeVerifier
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    loading: true,
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      setAuthState(prev => ({ ...prev, loading: false }))
      return
    }
    
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    
    if (accessToken && refreshToken) {
      setAuthState({
        isAuthenticated: true,
        accessToken,
        refreshToken,
        loading: false,
      })
    } else {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  const login = async () => {
    // Generate PKCE parameters
    const state = generateRandomString(40)
    const codeVerifier = generateRandomString(128)
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    
    // Store state and code verifier in sessionStorage for later verification
    sessionStorage.setItem('oauth_state', state)
    sessionStorage.setItem('oauth_code_verifier', codeVerifier)
    
    // Build OAuth parameters
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: window.location.origin + '/auth/callback',
      response_type: 'code',
      scope: SCOPES,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      prompt: 'login',
    })
    
    // Redirect to OAuth authorization endpoint
    window.location.href = `${API_BASE_URL}/oauth/authorize?${params.toString()}`
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
    setAuthState({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      loading: false,
    })
    router.navigate({ to: '/' })
  }

  const setTokens = (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
    }
    setAuthState({
      isAuthenticated: true,
      accessToken,
      refreshToken,
      loading: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        setTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export async function requireAuth() {
  if (typeof window === 'undefined') {
    throw new Error('Authentication required')
  }
  
  const accessToken = localStorage.getItem('access_token')
  
  if (!accessToken) {
    window.location.href = `${API_BASE_URL}/login?redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}`
    throw new Error('Authentication required')
  }
  
  return {
    auth: {
      isAuthenticated: true,
      accessToken,
    }
  }
}