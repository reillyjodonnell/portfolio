'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type PostItem = {
  route: string;
  title: string;
  description: string;
  date?: string;
  tags: string[];
};

type PostsListProps = {
  posts: PostItem[];
};

export default function PostsList({ posts }: PostsListProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showAllTags, setShowAllTags] = useState(false);
  const isAllActive = selectedTag === '';

  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(),
    [posts],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const tagMatch = selectedTag ? post.tags.includes(selectedTag) : true;
      if (!tagMatch) return false;

      if (!normalizedQuery) return true;

      return (
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.description.toLowerCase().includes(normalizedQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [posts, query, selectedTag]);

  const visibleTags = useMemo(() => {
    if (showAllTags) return tags;

    const curated = tags.slice(0, 4);
    if (selectedTag && !curated.includes(selectedTag)) {
      return [...curated, selectedTag];
    }

    return curated;
  }, [showAllTags, tags, selectedTag]);

  const remainingTagsCount = Math.max(tags.length - 4, 0);

  return (
    <div className="not-prose">
      <div
        style={{
          marginBottom: '.8rem',
          border: '1px solid color-mix(in srgb, var(--x-color-gray-400) 45%, transparent)',
          borderRadius: '.75rem',
          padding: '.1rem .25rem',
        }}
      >
        <input
          aria-label="Search posts"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search posts"
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            borderRadius: '.5rem',
            padding: '.5rem .6rem',
            background: 'transparent',
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '.45rem',
          marginBottom: '1rem',
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedTag('')}
          style={{
            border: isAllActive
              ? '1px solid var(--x-color-gray-600)'
              : '1px solid transparent',
            borderRadius: '.5rem',
            padding: '.25rem .6rem',
            fontSize: '.82rem',
            opacity: isAllActive ? 1 : 0.88,
            fontWeight: isAllActive ? 600 : 400,
            color: 'inherit',
            background: isAllActive
              ? 'color-mix(in srgb, var(--x-color-gray-400) 18%, transparent)'
              : 'transparent',
            cursor: 'pointer',
          }}
        >
          All
        </button>

        {visibleTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag((prev) => (prev === tag ? '' : tag))}
            style={{
              border:
                selectedTag === tag
                  ? '1px solid var(--x-color-gray-600)'
                  : '1px solid transparent',
              borderRadius: '.5rem',
              padding: '.25rem .6rem',
              fontSize: '.82rem',
              opacity: selectedTag && selectedTag !== tag ? 0.72 : 1,
              fontWeight: selectedTag === tag ? 600 : 400,
              background:
                selectedTag === tag
                  ? 'color-mix(in srgb, var(--x-color-gray-400) 18%, transparent)'
                  : 'transparent',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            {tag}
          </button>
        ))}

        {remainingTagsCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAllTags((prev) => !prev)}
            style={{
              border: '1px solid transparent',
              borderRadius: '.5rem',
              padding: '.25rem .35rem',
              fontSize: '.82rem',
              fontWeight: 500,
              cursor: 'pointer',
              opacity: 0.72,
              color: 'inherit',
              background: 'transparent',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            {showAllTags ? 'Show less' : `+${remainingTagsCount} more`}
          </button>
        )}
      </div>

      {filtered.map((post) => {
        const dateValue = post.date ? new Date(post.date) : null;

        return (
          <article
            key={post.route}
            style={{
              padding: '1rem 1rem .9rem 0',
              marginBottom: '.85rem',
            }}
          >
            <h3 style={{ margin: 0, marginBottom: '.35rem' }}>
              <Link href={post.route} style={{ textDecoration: 'none' }}>
                {post.title}
              </Link>
            </h3>

            <div
              style={{
                opacity: 0.75,
                fontSize: '.9rem',
                marginBottom: '.45rem',
              }}
            >
              {dateValue && !Number.isNaN(dateValue.getTime()) && (
                <time dateTime={dateValue.toISOString()}>
                  {dateValue.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              )}

              {post.tags.length > 0 && (
                <span style={{ marginLeft: '.6rem' }}>
                  • {post.tags.join(', ')}
                </span>
              )}
            </div>

            {post.description && (
              <p style={{ margin: 0, marginBottom: '.55rem' }}>
                {post.description}
              </p>
            )}

            <p style={{ margin: 0 }}>
              <Link href={post.route} className="readMoreLink">
                Read more <span className="readMoreArrow">→</span>
              </Link>
            </p>
          </article>
        );
      })}

      {filtered.length === 0 && (
        <p style={{ opacity: 0.75 }}>No posts matched your filter.</p>
      )}

      <style jsx>{`
        .readMoreArrow {
          display: inline-block;
          transition: transform 180ms ease;
        }

        .readMoreLink:hover .readMoreArrow,
        .readMoreLink:focus-visible .readMoreArrow {
          transform: translateX(0.25rem);
        }

        @media (prefers-reduced-motion: reduce) {
          .readMoreArrow {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
