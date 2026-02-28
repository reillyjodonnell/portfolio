import { getPosts } from './get-posts';
import PostsList from './posts-list';

export const metadata = {
  title: 'Posts',
};

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

export default async function PostsPage() {
  const posts = await getPosts();
  const serializedPosts = posts.map((post) => ({
    route: post.route,
    title: String(post.frontMatter.title || post.name || 'Untitled'),
    description: String(post.frontMatter.description || ''),
    date: post.frontMatter.date ? String(post.frontMatter.date) : undefined,
    tags: normalizeTags(post.frontMatter.tags || post.frontMatter.tag),
  }));

  return (
    <div data-pagefind-ignore="all">
      <h1>{metadata.title}</h1>
      <PostsList posts={serializedPosts} />
    </div>
  );
}
