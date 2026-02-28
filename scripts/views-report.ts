import { getPostViewCounts, isUpstashConfigured } from '../lib/post-views';

async function main() {
  if (!isUpstashConfigured()) {
    console.error(
      'Missing Redis env vars. Set UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL/KV_REST_API_TOKEN.',
    );
    process.exit(1);
  }

  const rows = await getPostViewCounts();

  if (!rows.length) {
    console.log('No views recorded yet.');
    return;
  }

  console.table(
    rows.map((row) => ({
      post: row.slug,
      views: row.views,
    })),
  );
}

void main();