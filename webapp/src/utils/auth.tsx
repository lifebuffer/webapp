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

const { apiBaseUrl: API_BASE_URL, clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, scopes: SCOPES } = authConfig

// OAuth PKCE helpers
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let text = ''
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

// Simple SHA-256 implementation for environments without crypto.subtle
function sha256(str: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount))
  }
  
  function sha256Hash(message: string): number[] {
    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]
    
    let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]
    
    const bytes = new TextEncoder().encode(message)
    const bitLength = bytes.length * 8
    const paddedLength = Math.ceil((bitLength + 65) / 512) * 512
    const paddedBytes = new Uint8Array(paddedLength / 8)
    paddedBytes.set(bytes)
    paddedBytes[bytes.length] = 0x80
    
    const view = new DataView(paddedBytes.buffer)
    view.setBigUint64(paddedBytes.length - 8, BigInt(bitLength), false)
    
    for (let chunk = 0; chunk < paddedBytes.length; chunk += 64) {
      const W = new Array(64)
      
      for (let i = 0; i < 16; i++) {
        W[i] = view.getUint32(chunk + i * 4, false)
      }
      
      for (let i = 16; i < 64; i++) {
        const s0 = rightRotate(W[i - 15], 7) ^ rightRotate(W[i - 15], 18) ^ (W[i - 15] >>> 3)
        const s1 = rightRotate(W[i - 2], 17) ^ rightRotate(W[i - 2], 19) ^ (W[i - 2] >>> 10)
        W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0
      }
      
      let [a, b, c, d, e, f, g, h] = H
      
      for (let i = 0; i < 64; i++) {
        const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)
        const ch = (e & f) ^ (~e & g)
        const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0
        const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)
        const maj = (a & b) ^ (a & c) ^ (b & c)
        const temp2 = (S0 + maj) >>> 0
        
        h = g
        g = f
        f = e
        e = (d + temp1) >>> 0
        d = c
        c = b
        b = a
        a = (temp1 + temp2) >>> 0
      }
      
      H[0] = (H[0] + a) >>> 0
      H[1] = (H[1] + b) >>> 0
      H[2] = (H[2] + c) >>> 0
      H[3] = (H[3] + d) >>> 0
      H[4] = (H[4] + e) >>> 0
      H[5] = (H[5] + f) >>> 0
      H[6] = (H[6] + g) >>> 0
      H[7] = (H[7] + h) >>> 0
    }
    
    return H
  }
  
  const hash = sha256Hash(str)
  const bytes = new Uint8Array(32)
  const view = new DataView(bytes.buffer)
  
  for (let i = 0; i < 8; i++) {
    view.setUint32(i * 4, hash[i], false)
  }
  
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(codeVerifier)
      const digest = await window.crypto.subtle.digest('SHA-256', data)
      const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)))
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    } catch (error) {
      console.warn('crypto.subtle failed, falling back to JS implementation:', error)
      return sha256(codeVerifier)
    }
  } else {
    console.warn('crypto.subtle not available, using JS SHA-256 implementation')
    return sha256(codeVerifier)
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
    
    console.log('Auth check - Access token exists:', !!accessToken)
    console.log('Auth check - Refresh token exists:', !!refreshToken)
    
    if (accessToken) {
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
    console.log('Setting tokens - Access token:', accessToken?.substring(0, 20) + '...')
    console.log('Setting tokens - Refresh token:', refreshToken?.substring(0, 20) + '...')
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken)
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken)
      }
      console.log('Tokens saved to localStorage')
    }
    
    setAuthState({
      isAuthenticated: true,
      accessToken,
      refreshToken,
      loading: false,
    })
    console.log('Auth state updated')
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