import { RedisClientType } from "@redis/client";
import { createClient } from "redis";
import { DbMessage } from "./types/toDb";
import { MessageToApi } from "./types/toApi";

export class RedisManager {
  private client: RedisClientType;
  private static instance: RedisManager;

  constructor() {
    this.client = createClient();
    this.client.connect();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  public pushMessage(message: DbMessage) {
    this.client.lPush("db process", JSON.stringify(message));
  }
  public publishMessage(channel: string, message) {
    this.client.lPush(channel, JSON.stringify(message));
  }
  public sendToApi(clientId: string, message: MessageToApi) {
    this.client.lPush(clientId, JSON.stringify(message));
  }
}
