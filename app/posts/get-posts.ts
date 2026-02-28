import { normalizePages } from 'nextra/normalize-pages';
import { getPageMap } from 'nextra/page-map';

export async function getPosts() {
  const { directories } = normalizePages({
    list: await getPageMap('/posts'),
    route: '/posts',
  });

  return directories
    .filter((post) => post.name !== 'index')
    .sort(
      (a, b) =>
        new Date(String(b.frontMatter.date || '')).getTime() -
        new Date(String(a.frontMatter.date || '')).getTime(),
    );
}

export async function getTags() {
  const posts = await getPosts();

  return posts.flatMap((post) => {
    const raw = post.frontMatter.tags ?? post.frontMatter.tag;

    if (Array.isArray(raw)) {
      return raw.map(String);
    }

    if (typeof raw === 'string') {
      return raw
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    return [];
  });
}
