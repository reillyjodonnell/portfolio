'use client';

import { useMemo } from 'react';

type BookmarkLink = {
  title: string;
  href: string;
};

type BookmarkGroup = {
  section: string;
  links: BookmarkLink[];
};

type BookmarksVariationsProps = {
  bookmarks: BookmarkGroup[];
};

function getHostname(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
}

export default function BookmarksVariations({ bookmarks }: BookmarksVariationsProps) {
  const normalized = useMemo(
    () =>
      bookmarks.map((group) => ({
        ...group,
        links: group.links.map((link) => ({ ...link, hostname: getHostname(link.href) })),
      })),
    [bookmarks],
  );

  return (
    <div className="not-prose" style={{ marginTop: '1.25rem' }}>
      {normalized.map((group, groupIndex) => {
        return (
          <section
            key={group.section}
            style={{
              marginBottom: '.8rem',
              paddingTop: groupIndex > 0 ? '.6rem' : 0,
              borderTop:
                groupIndex > 0
                  ? '1px solid color-mix(in srgb, var(--x-color-gray-400) 30%, transparent)'
                  : 'none',
            }}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: '.55rem',
                fontSize: '1rem',
              }}
            >
              {group.section}
            </h2>

            <div style={{ display: 'grid', gap: 0 }}>
              {group.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    padding: '.55rem 0',
                    lineHeight: 1.35,
                  }}
                >
                  <div style={{ fontSize: '.95rem' }}>{link.title}</div>
                  <div
                    style={{
                      opacity: 0.68,
                      fontSize: '.8rem',
                      marginTop: '.15rem',
                    }}
                  >
                    {link.hostname}
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}