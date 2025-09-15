import { createClient, RedisClientType } from "redis";
import { MessageToEngine } from "./types/toEngine";

export class RedisManager {
  private publisher: RedisClientType;
  private queue: RedisClientType;
  private static instance: RedisManager;

  private constructor() {
    this.publisher = createClient();
    this.publisher.connect();
    this.queue = createClient();
    this.queue.connect();
  }

  public static getInstance() {
    if (!this.instance) this.instance = new RedisManager();
    return this.instance;
  }

  public sendAndWait(message: MessageToEngine) {
    const id = this.generateRandomID();
    this.publisher.subscribe(id, (message) => {
      this.publisher.unsubscribe(id);
    });
    this.queue.lPush("messages", JSON.stringify({ cliendID: id, message }));
  }

  public generateRandomID() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
