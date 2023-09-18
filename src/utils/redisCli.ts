import { createClient } from 'redis';

const redisUrl = "redis://127.0.0.1:6379"

export const redisClient = createClient({url: redisUrl});
