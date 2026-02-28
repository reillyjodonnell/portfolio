import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken =
  process.env.UPSTASH_REDIS_REST_TOKEN ??
  process.env.KV_REST_API_TOKEN ??
  process.env.KV_REST_API_READ_ONLY_TOKEN;
const viewsHashKey = 'post:views';

export type PostViewRow = {
  slug: string;
  views: number;
};

let redisClient: Redis | null = null;

export function isUpstashConfigured() {
  return Boolean(redisUrl && redisToken);
}

function getRedisConfig() {
  if (!redisUrl || !redisToken) {
    throw new Error(
      'Missing Redis env vars. Provide UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL/KV_REST_API_TOKEN.',
    );
  }

  return { redisUrl, redisToken };
}

function getRedisClient() {
  if (!redisClient) {
    getRedisConfig();
    redisClient = Redis.fromEnv();
  }

  return redisClient;
}

export async function incrementPostView(slug: string) {
  const redis = getRedisClient();
  await redis.hincrby(viewsHashKey, slug, 1);
}

export async function getPostViewCounts(): Promise<PostViewRow[]> {
  const redis = getRedisClient();
  const result = await redis.hgetall<Record<string, number | string>>(viewsHashKey);

  if (!result || Object.keys(result).length === 0) {
    return [];
  }

  const rows = Object.entries(result).map(([slug, viewsRaw]) => ({
    slug,
    views: typeof viewsRaw === 'number' ? viewsRaw : Number.parseInt(String(viewsRaw), 10) || 0,
  }));

  return rows.sort((a, b) => b.views - a.views || a.slug.localeCompare(b.slug));
}