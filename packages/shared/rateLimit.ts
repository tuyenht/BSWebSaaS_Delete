import 'server-only';
import { getRedis } from './cache/redisClient';

export type RateLimitOptions = {
  key: string;          // vd: login:ip:1.2.3.4
  windowSeconds: number;
  maxHits: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
};

export async function rateLimit(
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const redis = getRedis();
  if (!redis) {
    // Không có Redis thì luôn cho qua (chỉ dùng trong dev)
    return { allowed: true, remaining: options.maxHits };
  }

  const { key, windowSeconds, maxHits } = options;
  const now = Date.now();

  const lua = `
    local key = KEYS[1]
    local window = tonumber(ARGV[1])
    local maxHits = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])

    local data = redis.call("HMGET", key, "count", "start")
    local count = tonumber(data[1]) or 0
    local start = tonumber(data[2]) or now

    if now - start >= window * 1000 then
      count = 0
      start = now
    end

    count = count + 1
    redis.call("HMSET", key, "count", count, "start", start)
    redis.call("EXPIRE", key, window)

    local remaining = maxHits - count
    return { count, remaining, start }
  `;

  const [countStr, remainingStr, startStr] = (await redis.eval(lua, 1, key, String(windowSeconds), String(maxHits), String(now))) as string[];

  const count = Number(countStr);
  const remaining = Number(remainingStr);
  const start = Number(startStr);

  if (count > maxHits) {
    const elapsed = (now - start) / 1000;
    const retryAfter = Math.max(0, windowSeconds - elapsed);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfter),
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, remaining),
  };
}
