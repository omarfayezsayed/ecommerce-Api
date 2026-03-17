import { redisClient } from "../config/redisConnection";

const EXPIRY = 15 * 60; // 15 minutes in seconds

export class RedisService {
  // store verification code
  async saveVerificationCode(userId: string, code: string): Promise<void> {
    await redisClient.setEx(
      `verification:${code}`, // key
      EXPIRY, // TTL in seconds — auto deletes after 15min
      userId, // value
    );
  }

  // get verification code
  async getVerificationCode(code: string): Promise<string | null> {
    return redisClient.get(`verification:${code}`);
  }

  // delete verification code after use
  async deleteVerificationCode(code: string): Promise<void> {
    await redisClient.del(`verification:${code}`);
  }

  async saveResetCode(userId: string, code: string): Promise<void> {
    await redisClient.setEx(`reset:${code}`, EXPIRY, userId);
  }

  // get reset code
  async getResetCode(code: string): Promise<string | null> {
    return redisClient.get(`reset:${code}`);
  }

  // delete reset code after use
  async deleteResetCode(code: string): Promise<void> {
    await redisClient.del(`reset:${code}`);
  }
}
