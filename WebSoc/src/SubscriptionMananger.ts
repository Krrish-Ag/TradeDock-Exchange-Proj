import { createClient, RedisClientType } from "redis";
import { UserManager } from "./UserManager";

export class SubscriptionManager {
  private static instance: SubscriptionManager;
  private redisClient: RedisClientType; //this redis is mp when engine after processing give the update to ws thru this redis itself i believe
  private userToSubscriptions: Map<string, string[]> = new Map(); //which all subs is a user connected to
  private subscriptionToUsers: Map<string, string[]> = new Map(); //who all users are connected to this sub

  private constructor() {
    this.redisClient = createClient();
    this.redisClient.connect();
  }

  public static getInstance() {
    if (!this.instance) this.instance = new SubscriptionManager();
    return this.instance;
  }

  public subscribe(userId: string, sub: string) {
    if (this.userToSubscriptions.get(userId)?.includes(sub)) return;

    //adding sub to the user
    if (!this.userToSubscriptions.has(userId)) {
      this.userToSubscriptions.set(userId, [sub]);
    } else {
      this.userToSubscriptions.get(userId)?.push(sub);
    }

    //adding user to the sub
    if (!this.subscriptionToUsers.has(sub)) {
      this.subscriptionToUsers.set(sub, [userId]);
    } else {
      this.subscriptionToUsers.get(sub)?.push(userId);
    }

    //if a sub has been connected for the first time, need to CONNECT TO REDIS so that for any upcomibng msgs coming to this channel, we receive them
    if (this.subscriptionToUsers.get(sub)?.length === 1) {
      this.redisClient.subscribe(sub, this.redisCallbackHandler);
    }
  }

  //and in this fn, ALL THE USERS who are connected to that chnanel will be receiving the updates from the emit method described in User
  public redisCallbackHandler(message: string, channel: string) {
    const parsedMessage = JSON.parse(message);
    this.subscriptionToUsers
      .get(channel)
      ?.forEach((user) =>
        UserManager.getInstance().getUser(user)?.emit(parsedMessage)
      );
  }

  public unsubscribe(userId: string, sub: string) {}

  public userLeft(userId: string) {
    this.userToSubscriptions
      .get(userId)
      ?.forEach((sub) => this.unsubscribe(userId, sub));
  }
}
