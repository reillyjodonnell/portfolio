'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type CSSProperties } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'about' },
  { href: '/posts', label: 'posts' },
  { href: '/bookmarks', label: 'bookmarks' },
] as const;

const linkStyle = (active: boolean, hovered = false): CSSProperties => ({
  border: '1px solid transparent',
  borderRadius: '.5rem',
  padding: '.2rem .55rem',
  fontSize: '.92rem',
  fontWeight: active ? 600 : 400,
  opacity: active ? 1 : 0.88,
  color: 'inherit',
  background: active
    ? 'color-mix(in srgb, var(--x-color-gray-400) 18%, transparent)'
    : hovered
      ? 'color-mix(in srgb, var(--x-color-gray-400) 10%, transparent)'
      : 'transparent',
  textDecoration: 'none',
  transition: 'background 150ms ease',
});

export default function NavLinks() {
  const pathname = usePathname();
  const currentPath = pathname ?? '/';
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="x:flex x:items-center x:gap-2">
      {NAV_ITEMS.map(({ href, label }) => {
        const isActive =
          href === '/' ? currentPath === '/' : currentPath.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            onMouseEnter={() => setHovered(href)}
            onMouseLeave={() => setHovered(null)}
            style={linkStyle(isActive, hovered === href)}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}