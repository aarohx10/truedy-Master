/**
 * Centralized Authentication Manager
 * 
 * This singleton manages the authentication lifecycle, providing:
 * - Token storage and retrieval
 * - Automatic token refresh on 401
 * - Ready state promise for components to wait on
 * - Event system for auth state changes
 * - Request queue during token refresh
 */

type TokenChangeListener = (token: string | null) => void
type GetTokenFn = () => Promise<string | null>

class AuthManager {
  private token: string | null = null
  private clientId: string | null = null
  private refreshPromise: Promise<string | null> | null = null
  private getTokenFn: GetTokenFn | null = null
  private listeners: Set<TokenChangeListener> = new Set()
  private readyResolve: (() => void) | null = null
  private isReadyResolved = false
  private _isRefreshing = false
  private lastRefreshTime = 0
  private readonly MIN_REFRESH_INTERVAL = 5000 // 5 seconds between refreshes
  
  // Public promise that resolves when auth is complete
  public isReady: Promise<void>

  constructor() {
    this.isReady = new Promise(resolve => {
      this.readyResolve = resolve
    })
  }

  /**
   * Set the function used to get fresh tokens from Clerk
   */
  setGetTokenFn(fn: GetTokenFn) {
    this.getTokenFn = fn
  }

  /**
   * Set token and clientId, marking auth as ready
   */
  setAuth(token: string, clientId: string | null) {
    const tokenChanged = this.token !== token
    const clientIdChanged = this.clientId !== clientId
    
    this.token = token
    this.clientId = clientId
    
    // Notify listeners if token changed
    if (tokenChanged) {
      this.notifyListeners(token)
    }
    
    // Mark as ready on first successful auth
    if (!this.isReadyResolved && this.readyResolve) {
      this.isReadyResolved = true
      this.readyResolve()
    }
    
    console.log('[AuthManager] Auth set', { 
      tokenLength: token.length, 
      clientId,
      tokenChanged,
      clientIdChanged 
    })
  }

  /**
   * Get current token (may be stale)
   */
  getToken(): string | null {
    return this.token
  }

  /**
   * Get current clientId
   */
  getClientId(): string | null {
    return this.clientId
  }

  /**
   * Check if we have a token
   */
  hasToken(): boolean {
    return this.token !== null
  }

  /**
   * Check if a token refresh is in progress
   */
  get isRefreshing(): boolean {
    return this._isRefreshing
  }

  /**
   * Clear auth state (on logout)
   */
  clearAuth() {
    console.log('[AuthManager] Clearing auth')
    this.token = null
    this.clientId = null
    this.notifyListeners(null)
    
    // Reset ready state for next login
    this.isReadyResolved = false
    this.isReady = new Promise(resolve => {
      this.readyResolve = resolve
    })
  }

  /**
   * Get a valid token, refreshing if necessary
   * This is the primary method API client should use
   */
  async getValidToken(): Promise<string | null> {
    // If we're already refreshing, wait for that to complete
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    // If we have a token and haven't been asked to refresh, return it
    if (this.token) {
      return this.token
    }

    // No token, try to refresh
    return this.refreshToken()
  }

  /**
   * Force refresh the token
   * Used when a 401 is received
   */
  async refreshToken(): Promise<string | null> {
    // Debounce refreshes
    const now = Date.now()
    if (now - this.lastRefreshTime < this.MIN_REFRESH_INTERVAL) {
      console.log('[AuthManager] Skipping refresh, too soon since last refresh')
      return this.token
    }

    // If already refreshing, return the existing promise
    if (this.refreshPromise) {
      console.log('[AuthManager] Already refreshing, waiting for existing refresh')
      return this.refreshPromise
    }

    // If no getToken function is set, we can't refresh
    if (!this.getTokenFn) {
      console.warn('[AuthManager] No getToken function set, cannot refresh')
      return null
    }

    console.log('[AuthManager] Starting token refresh')
    this._isRefreshing = true
    this.lastRefreshTime = now

    this.refreshPromise = (async () => {
      try {
        const freshToken = await this.getTokenFn!()
        
        if (freshToken) {
          this.token = freshToken
          this.notifyListeners(freshToken)
          console.log('[AuthManager] Token refreshed successfully', { tokenLength: freshToken.length })
          return freshToken
        } else {
          console.warn('[AuthManager] Token refresh returned null')
          return null
        }
      } catch (error) {
        console.error('[AuthManager] Token refresh failed:', error)
        return null
      } finally {
        this._isRefreshing = false
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  /**
   * Subscribe to token changes
   */
  onTokenChange(callback: TokenChangeListener): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * Notify all listeners of token change
   */
  private notifyListeners(token: string | null) {
    this.listeners.forEach(callback => {
      try {
        callback(token)
      } catch (error) {
        console.error('[AuthManager] Listener error:', error)
      }
    })
  }

  /**
   * Wait for auth to be ready with timeout
   */
  async waitForAuth(timeoutMs: number = 10000): Promise<boolean> {
    const timeoutPromise = new Promise<boolean>(resolve => {
      setTimeout(() => resolve(false), timeoutMs)
    })

    const readyPromise = this.isReady.then(() => true)

    return Promise.race([readyPromise, timeoutPromise])
  }
}

// Export singleton instance
export const authManager = new AuthManager()

// Also export the class for testing
export { AuthManager }
