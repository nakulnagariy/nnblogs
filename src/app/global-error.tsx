'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Replaces the root layout on crash — must include <html> and <body>
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <AlertOctagon
            style={{ marginBottom: '1rem', height: '3rem', width: '3rem', color: '#ef4444' }}
            aria-hidden="true"
          />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Application error
          </h1>
          <p style={{ marginBottom: '1.5rem', color: '#6b7280', maxWidth: '28rem' }}>
            A critical error occurred. Please refresh the page to try again.
          </p>
          {error.digest && (
            <p style={{ marginBottom: '1.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '0.375rem',
              backgroundColor: '#111827',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#ffffff',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            <RefreshCw style={{ height: '1rem', width: '1rem' }} />
            Refresh page
          </button>
        </div>
      </body>
    </html>
  );
}
