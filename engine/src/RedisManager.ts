import { RedisClientType } from "@redis/client";
import { createClient } from "redis";
import { DbMessage } from "./types/toDb";
import { MessageToApi } from "./types/toApi";
import { WsMessage } from "./types/toWS";

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

  //need to publish here, as it is pubsub
  public publishMessage(channel: string, message: WsMessage) {
    this.client.publish(channel, JSON.stringify(message));
  }

  //need to publish here, as it is pubsub
  public sendToApi(clientId: string, message: MessageToApi) {
    console.log(clientId, message);
    this.client.publish(clientId, JSON.stringify(message));
  }
}
