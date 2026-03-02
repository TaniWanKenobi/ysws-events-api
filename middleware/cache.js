const { Redis } = require('@upstash/redis');

let client = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  client = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  console.log('Upstash Redis connected — caching enabled');
} else {
  console.log('Upstash Redis not configured — caching disabled');
}

const cache = (duration) => {
  return async (req, res, next) => {
    if (!client) return next();

    const key = `events:${req.originalUrl}`;

    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(cached);
      }

      const originalJson = res.json.bind(res);
      res.json = (data) => {
        if (data.success) {
          client.set(key, data, { ex: duration });
        }
        originalJson(data);
      };

      next();
    } catch {
      next();
    }
  };
};

module.exports = cache;
