'use client';

import { useEffect } from 'react';

type PostViewTrackerProps = {
  slug: string;
};

export default function PostViewTracker({ slug }: PostViewTrackerProps) {
  useEffect(() => {
    const key = `viewed-post:${slug}`;

    try {
      if (sessionStorage.getItem(key)) {
        return;
      }

      sessionStorage.setItem(key, '1');
    } catch {
      return;
    }

    void fetch('/api/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {
      try {
        sessionStorage.removeItem(key);
      } catch {}
    });
  }, [slug]);

  return null;
}