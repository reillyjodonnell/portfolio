import { NextResponse } from 'next/server';
import { incrementPostView, isUpstashConfigured } from '../../../lib/post-views';

const isValidSlug = (value: string) => /^[a-z0-9-]+$/i.test(value);

export async function POST(request: Request) {
  if (!isUpstashConfigured()) {
    return NextResponse.json(
      {
        ok: true,
        tracked: false,
      },
      { status: 200 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  const slug =
    typeof body === 'object' && body !== null && 'slug' in body
      ? (body as { slug?: unknown }).slug
      : null;

  if (typeof slug !== 'string' || !isValidSlug(slug)) {
    return NextResponse.json({ ok: false, error: 'Invalid post slug.' }, { status: 400 });
  }

  try {
    await incrementPostView(slug);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Failed to persist view count.' },
      { status: 500 },
    );
  }
}