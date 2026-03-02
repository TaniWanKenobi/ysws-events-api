const redis = require('redis');

let client = null;
let isConnected = false;

(async () => {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    client.on('error', () => {});
    await client.connect();
    isConnected = true;
    console.log('Redis connected — caching enabled');
  } catch {
    console.log('Redis not available — caching disabled');
  }
})();

const cache = (duration) => {
  return async (req, res, next) => {
    if (!isConnected) return next();

    const key = `events:${req.originalUrl}`;

    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const originalJson = res.json.bind(res);
      res.json = (data) => {
        client.setEx(key, duration, JSON.stringify(data));
        originalJson(data);
      };

      next();
    } catch {
      next();
    }
  };
};

module.exports = cache;
