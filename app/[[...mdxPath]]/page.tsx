import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { useMDXComponents as getMDXComponents } from '../../mdx-components';

export const generateStaticParams = generateStaticParamsFor('mdxPath');

type PageProps = Readonly<{
  params: Promise<{
    mdxPath?: string[];
  }>;
}>;

const isValidMdxPath = (mdxPath: string[] = []) =>
  mdxPath.every((segment) => /^[a-z0-9-]+$/i.test(segment));

export async function generateMetadata(props: PageProps) {
  const params = await props.params;

  if (!isValidMdxPath(params.mdxPath)) {
    return {};
  }

  try {
    const { metadata } = await importPage(params.mdxPath);
    return metadata;
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
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
};

export default Page;
