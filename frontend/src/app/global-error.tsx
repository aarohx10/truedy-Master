'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log RAW error with full details
    console.error('[GLOBAL_ERROR] Unhandled error caught (RAW ERROR)', {
      error,
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
      errorDigest: error.digest,
      errorCause: (error as any).cause,
      fullErrorObject: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
      errorProps: Object.getOwnPropertyNames(error),
      errorDescriptors: Object.getOwnPropertyDescriptors(error),
    })
  }, [error])

  return (
    <html>
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong!</h2>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            {error.message || 'An unexpected error occurred'}
          </p>
          <button 
            onClick={() => reset()}
            style={{ 
              marginTop: '1rem', 
              padding: '0.5rem 1rem', 
              cursor: 'pointer',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}

