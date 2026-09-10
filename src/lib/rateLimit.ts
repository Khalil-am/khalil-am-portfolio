type RateLimitOptions = {
  namespace: string;
  limit: number;
  windowMs: number;
};

type Bucket = { count: number; resetAt: number };

const globalRateLimit = globalThis as typeof globalThis & {
  portfolioRateLimitBuckets?: Map<string, Bucket>;
};

const buckets =
  globalRateLimit.portfolioRateLimitBuckets ?? new Map<string, Bucket>();
globalRateLimit.portfolioRateLimitBuckets = buckets;

function clientAddress(request: Request): string {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * A best-effort per-instance limit. Vercel Firewall or a distributed store should
 * remain the outer control when the site runs across multiple server instances.
 */
export function checkRateLimit(
  request: Request,
  { namespace, limit, windowMs }: RateLimitOptions,
) {
  const now = Date.now();
  const key = `${namespace}:${clientAddress(request)}`;
  const current = buckets.get(key);
  const bucket =
    !current || current.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : current;

  bucket.count += 1;
  buckets.set(key, bucket);

  if (buckets.size > 5_000) {
    for (const [candidate, value] of buckets) {
      if (value.resetAt <= now) buckets.delete(candidate);
    }
    while (buckets.size > 5_000) {
      const oldest = buckets.keys().next().value;
      if (typeof oldest !== "string") break;
      buckets.delete(oldest);
    }
  }

  const remaining = Math.max(0, limit - bucket.count);
  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1_000));
  const headers = {
    "Cache-Control": "no-store",
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(bucket.resetAt / 1_000)),
  };

  return {
    allowed: bucket.count <= limit,
    headers,
    retryAfter,
  };
}
