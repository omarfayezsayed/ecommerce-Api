import { createClient } from "redis";
console.log(process.env.REDIS_URL);
export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.on("connect", () => console.log("✓ Redis connected"));

export const connect = async () => {
  await redisClient.connect();
};
