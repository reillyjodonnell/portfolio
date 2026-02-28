'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'about' },
  { href: '/posts', label: 'posts' },
  { href: '/bookmarks', label: 'bookmarks' },
] as const;

export default function NavLinks() {
  const pathname = usePathname();
  const currentPath = pathname ?? '/';

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
            style={{
              border: isActive
                ? '1px solid var(--x-color-gray-600)'
                : '1px solid transparent',
              borderRadius: '.5rem',
              padding: '.2rem .55rem',
              fontSize: '.92rem',
              opacity: isActive ? 1 : 0.88,
              fontWeight: isActive ? 600 : 400,
              color: 'inherit',
              background: isActive
                ? 'color-mix(in srgb, var(--x-color-gray-400) 18%, transparent)'
                : 'transparent',
              textDecoration: 'none',
            }}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}