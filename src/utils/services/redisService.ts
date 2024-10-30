import { createClient, RedisClientType } from "redis";

class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      socket: {
        host: 'redis',
        port: 6379,
      }
    });
    this.client.connect().then(() => console.log("Connected successfully to Redis")).catch((error: any) => console.error("Redis Error:", error));
    // this.client.on("connect", () => console.log("Connected successfully to Redis"));
    // this.client.on("error", (error: any) => console.error("Redis Error:", error));
  }
async connect() {
     this.client.connect()
      console.log("Connected successfully to Redis");
  }

  async revokeToken(token: string): Promise<void> {
    await this.connect()
    await this.client.set(token, "revoked", { EX: 30 * 24 * 60 * 60 });
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    await this.connect()
    const result = await this.client.get(token);
    return result !== null;
  }

  async quit(): Promise<string | void> {
    await this.connect()
    return this.client.quit();
  }
}

const redis = new RedisService();
export default redis;
