import 'nextra-theme-blog/style.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import '../styles/main.css';

const SITE_URL = 'https://reilly.dev';
const SITE_NAME = "Reilly's blog";
const DEFAULT_DESCRIPTION = 'Articles focus on React, React Native, TS, and Next.';
const DEFAULT_IMAGE =
  'https://assets.vercel.com/image/upload/q_auto/front/vercel/dps.png';
const TWITTER_HANDLE = '@reillyjodonnell';

function toAbsoluteUrl(value: string) {
  try {
    return new URL(value, SITE_URL).toString();
  } catch {
    return new URL(DEFAULT_IMAGE, SITE_URL).toString();
  }
}

function withLeadingSlash(value: string) {
  return value.startsWith('/') ? value : `/${value}`;
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const frontMatter =
    typeof pageProps === 'object' && pageProps ? pageProps.frontMatter : undefined;

  const isPost = router.asPath.startsWith('/posts/') && router.asPath !== '/posts';
  const title = frontMatter?.title
    ? `${frontMatter.title} | ${SITE_NAME}`
    : SITE_NAME;
  const description = frontMatter?.description || DEFAULT_DESCRIPTION;
  const image = toAbsoluteUrl(frontMatter?.image || DEFAULT_IMAGE);
  const url = toAbsoluteUrl(withLeadingSlash(router.asPath.split('?')[0] || '/'));

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="follow, index" />

        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content={isPost ? 'article' : 'website'} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:creator" content={TWITTER_HANDLE} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS"
          href="/feed.xml"
        />
        <link
          rel="preload"
          href="/fonts/Inter-roman.latin.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
