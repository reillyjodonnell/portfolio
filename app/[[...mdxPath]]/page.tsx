import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import PostViewTracker from '../../components/post-view-tracker';
import { useMDXComponents as getMDXComponents } from '../../mdx-components';

export const generateStaticParams = generateStaticParamsFor('mdxPath');

type PageProps = Readonly<{
  params: Promise<{
    mdxPath?: string[];
  }>;
}>;

const isValidMdxPath = (mdxPath: string[] = []) =>
  mdxPath.every((segment) => /^[a-z0-9-]+$/i.test(segment));

const siteUrl = 'https://reilly.dev';
const fallbackImage = '/images/reilly.jpeg';
const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];

function normalizeImagePath(value: string) {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return value.startsWith('/') ? value : `/${value}`;
}

async function findExistingPublicImage(relativePathWithoutExt: string) {
  for (const ext of imageExtensions) {
    const relativePath = `${relativePathWithoutExt}.${ext}`;
    const absolutePath = path.join(process.cwd(), 'public', relativePath);

    try {
      await access(absolutePath);
      return `/${relativePath}`;
    } catch {}
  }

  return null;
}

function extractFirstLocalImageFromSource(sourceCode: unknown) {
  if (typeof sourceCode !== 'string') {
    return null;
  }

  const mdxImageMatch = sourceCode.match(
    /src=["']((?:\/images\/|https?:\/\/)[^"']+\.(?:png|jpe?g|webp|gif)(?:\?[^"']*)?)["']/i,
  );

  if (mdxImageMatch?.[1]) {
    return mdxImageMatch[1];
  }

  const markdownImageMatch = sourceCode.match(
    /!\[[^\]]*\]\(((?:\/images\/|https?:\/\/)[^)]+\.(?:png|jpe?g|webp|gif)(?:\?[^)]*)?)\)/i,
  );

  return markdownImageMatch?.[1] ?? null;
}

async function getFrontmatterImageFromFile(mdxPath: string[]) {
  const routePath = mdxPath.join('/');
  const candidates = [
    path.join(process.cwd(), 'content', `${routePath}.mdx`),
    path.join(process.cwd(), 'content', `${routePath}.md`),
  ];

  for (const candidate of candidates) {
    try {
      const content = await readFile(candidate, 'utf8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

      if (!frontmatterMatch?.[1]) {
        continue;
      }

      const imageLineMatch = frontmatterMatch[1].match(/^image:\s*(.+)$/m);

      if (!imageLineMatch?.[1]) {
        continue;
      }

      const rawValue = imageLineMatch[1].trim();
      const unquotedValue = rawValue.replace(/^['"]|['"]$/g, '');

      if (!unquotedValue) {
        continue;
      }

      return normalizeImagePath(unquotedValue);
    } catch {}
  }

  return null;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  if (!isValidMdxPath(params.mdxPath)) {
    return {};
  }

  try {
    const { metadata, sourceCode } = await importPage(params.mdxPath);
    const metadataRecord = metadata as Record<string, unknown>;
    const mdxPath = params.mdxPath ?? [];
    const isPost = mdxPath[0] === 'posts';

    if (!isPost) {
      return metadata as Metadata;
    }

    const slug = mdxPath[1];
    const pathname = slug ? `/posts/${slug}` : '/posts';
    const title =
      typeof metadataRecord.title === 'string'
        ? metadataRecord.title
        : "Reilly's blog";
    const description =
      typeof metadataRecord.description === 'string'
        ? metadataRecord.description
        : 'Articles focus on React, React Native, TS, and Next.';

    const frontmatterImage =
      typeof metadataRecord.image === 'string'
        ? normalizeImagePath(metadataRecord.image)
        : await getFrontmatterImageFromFile(mdxPath);
    const imageFromSource = extractFirstLocalImageFromSource(sourceCode);
    const image =
      frontmatterImage ??
      imageFromSource ??
      (await findExistingPublicImage(`images/${slug}/cover`)) ??
      fallbackImage;

    return {
      ...(metadata as Metadata),
      title,
      description,
      openGraph: {
        type: 'article',
        url: `${siteUrl}${pathname}`,
        siteName: "Reilly's blog",
        title,
        description,
        images: [image],
      },
      twitter: {
        card: 'summary_large_image',
        creator: '@reillyjodonnell',
        site: '@reillyjodonnell',
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: pathname,
      },
    };
  } catch {
    return {};
  }
}

const Wrapper = getMDXComponents().wrapper;

const Page: FC<PageProps> = async (props) => {
  const params = await props.params;

  if (!isValidMdxPath(params.mdxPath)) {
    notFound();
  }

  let pageModule;

  try {
    pageModule = await importPage(params.mdxPath);
  } catch {
    notFound();
  }

  const { default: MDXContent, toc, metadata, sourceCode } = pageModule;

  const isPost = params.mdxPath?.[0] === 'posts';
  const postSlug = isPost ? params.mdxPath?.[1] : undefined;
  const metadataRecord = metadata as Record<string, unknown>;
  const rawTag = metadataRecord.tag;
  const normalizedMetadata = isPost
    ? {
        ...metadata,
        author: 'Reilly',
        tags:
          metadataRecord.tags ??
          (typeof rawTag === 'string'
            ? rawTag
                .split(',')
                .map((tag: string) => tag.trim())
                .filter(Boolean)
            : rawTag),
      }
    : metadata;

  return (
    <Wrapper toc={toc} metadata={normalizedMetadata} sourceCode={sourceCode}>
      {typeof postSlug === 'string' ? <PostViewTracker slug={postSlug} /> : null}
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
};

export default Page;
