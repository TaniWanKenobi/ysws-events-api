const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.error('Redis error:', err));
client.connect();

const cache = (duration) => {
  return async (req, res, next) => {
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
    } catch (error) {
      next();
    }
  };
};

module.exports = cache;
