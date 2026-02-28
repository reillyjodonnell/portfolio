import type { Metadata } from 'next';
import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import type { ReactNode } from 'react';
import NavLinks from './nav-links';
import 'nextra-theme-blog/style.css';
import '../styles/main.css';

export const metadata: Metadata = {
  title: {
    default: "Reilly's blog",
    template: "%s | Reilly's blog",
  },
  description: 'Articles focus on React, React Native, TS, and Next.',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pageMap = await getPageMap();

  return (
    <html lang="en" suppressHydrationWarning>
      <Head backgroundColor={{ dark: '#111111', light: '#fefce8' }} />
      <body>
        <Layout>
          <Navbar pageMap={pageMap}>
            <NavLinks />
            <ThemeSwitch />
          </Navbar>

          {children}

          <Footer>
            {new Date().getFullYear()} © Reilly O&apos;Donnell.
            <a href="/feed.xml" style={{ float: 'right' }}>
              RSS
            </a>
          </Footer>
        </Layout>
      </body>
    </html>
  );
}
