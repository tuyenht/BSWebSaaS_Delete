export const env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    redisUrl: process.env.REDIS_URL ?? '',
    redisMaxMemoryMb: Number(process.env.REDIS_MAX_MEMORY_MB ?? '512'),
    payloadCacheTags: process.env.PAYLOAD_CACHE_TAGS === 'true',
  };
  