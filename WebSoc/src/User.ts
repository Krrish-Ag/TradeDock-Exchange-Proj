import WebSocket from "ws";
import { OutMessage } from "./types/out";
import { InMessage, UNSUBSCRIBE } from "./types/in";

export class User {
  private id: string;
  private ws: WebSocket;
  private subscriptions: string[] = [];

  constructor(id: string, ws: WebSocket) {
    this.id = id;
    this.ws = ws;
  }

  public subscribe(sub: string) {
    this.subscriptions.push(sub);
  }

  public unsubscribe(sub: string) {
    this.subscriptions = this.subscriptions.filter((x) => x !== sub);
  }

  public emit(message: OutMessage) {
    this.ws.send(JSON.stringify(message));
  }

  public addListners() {
    this.ws.on("message", (message: string) => {
      const msg: InMessage = JSON.parse(message);
      if (msg.type === "SUBSCRIBE") {
        msg.params.forEach((s) =>
          SubscriptionManager.getInstance().subscribe(this.id, s)
        );
      }

      if (msg.type === UNSUBSCRIBE) {
        msg.params.forEach((s) =>
          SubscriptionManager.getInstance().unsubscribe(this.id, msg.params[0])
        );
      }
    });
  }
}
