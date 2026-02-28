import { PostCard } from 'nextra-theme-blog';
import { getPosts, getTags } from '../../posts/get-posts';

type PageProps = {
  params: Promise<{
    tag: string;
  }>;
};

export async function generateMetadata(props: PageProps) {
  const params = await props.params;

  return {
    title: `Posts Tagged with “${decodeURIComponent(params.tag)}”`,
  };
}

export async function generateStaticParams() {
  const allTags = await getTags();

  return Array.from(new Set(allTags)).map((tag) => ({ tag }));
}

export default async function TagPage(props: PageProps) {
  const params = await props.params;
  const decodedTag = decodeURIComponent(params.tag);
  const posts = await getPosts();

  return (
    <>
      <h1>{`Posts Tagged with “${decodedTag}”`}</h1>

      {posts
        .filter((post) => {
          const raw = post.frontMatter.tags ?? post.frontMatter.tag;

          if (Array.isArray(raw)) {
            return raw.map(String).includes(decodedTag);
          }

          if (typeof raw === 'string') {
            return raw
              .split(',')
              .map((tag) => tag.trim())
              .includes(decodedTag);
          }

          return false;
        })
        .map((post) => (
          <PostCard
            key={post.route}
            post={{ route: post.route, frontMatter: post.frontMatter as any }}
          />
        ))}
    </>
  );
}
