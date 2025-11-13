import Redis from 'ioredis';
import { env } from '../env';

let client: Redis | null = null;

export function getRedis() {
  if (!env.redisUrl) return null;
  if (!client) {
    client = new Redis(env.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
    });

    client.on('error', (err: Error) => {
      console.error('[redis] error', err.message);
    });
  }
  return client;
}

