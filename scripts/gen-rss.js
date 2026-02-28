const { promises: fs } = require('fs');
const path = require('path');
const RSS = require('rss');
const matter = require('gray-matter');

async function generate() {
  const feed = new RSS({
    title: "Reilly O'Donnell",
    site_url: 'https://reilly.dev',
    feed_url: 'https://reilly.dev/feed.xml',
  });

  const posts = await fs.readdir(
    path.join(__dirname, '..', 'content', 'posts'),
  );

  await Promise.all(
    posts.map(async (name) => {
      if (name.startsWith('index.')) return;

      const content = await fs.readFile(
        path.join(__dirname, '..', 'content', 'posts', name),
      );
      const frontmatter = matter(content);
      const rawCategories = frontmatter.data.tags || frontmatter.data.tag || [];
      const categories = Array.isArray(rawCategories)
        ? rawCategories
        : String(rawCategories)
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean);

      feed.item({
        title: frontmatter.data.title,
        url: '/posts/' + name.replace(/\.mdx?/, ''),
        date: frontmatter.data.date,
        description: frontmatter.data.description,
        categories,
        author: frontmatter.data.author,
      });
    }),
  );

  await fs.writeFile('./public/feed.xml', feed.xml({ indent: true }));
}

generate();
