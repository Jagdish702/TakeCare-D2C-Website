import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchContent } from '../api/content';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Content = any;

const ContentContext = createContext<Content>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Content>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    fetchContent()
      .then(setData)
      .catch((err: Error) => setError(err.message || 'Failed to load content'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          height: '100vh',
          width: '100%',
          background: '#000',
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <p style={{ margin: 0 }}>Couldn't load the page content.</p>
        <button
          type="button"
          onClick={load}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: '1px solid #fff',
            background: 'transparent',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100%',
          background: '#000',
        }}
      />
    );
  }

  return <ContentContext.Provider value={data}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return ctx;
}
