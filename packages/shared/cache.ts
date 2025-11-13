import { getRedis } from './cache/redisClient';

type CacheOptions<T> = {
  key: string;
  ttlSeconds?: number;
  loader: () => Promise<T>;
};

export async function cache<T>({
  key,
  ttlSeconds = 300,
  loader,
}: CacheOptions<T>): Promise<T> {
  const redis = getRedis();
  if (!redis) {
    // Fallback: no Redis, just run loader
    return loader();
  }

  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    console.error('[cache] read error', (err as Error).message);
  }

  const value = await loader();

  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (err) {
    console.error('[cache] write error', (err as Error).message);
  }

  return value;
}
