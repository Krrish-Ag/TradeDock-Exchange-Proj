import { Depth, Ticker, Trade } from "./types";

export const BASE_URL = "wss://stream.binance.com:9443/ws";

//creating a singleton, as dont want to create numtiple websocket connections
export class WSClient {
  private ws: WebSocket;
  private static instance: WSClient;
  private bufferedMessages: any[] = [];
  private callbacks: { [type: string]: any[] } = {};
  private id: number;
  private initialized: boolean = false;

  private constructor() {
    this.ws = new WebSocket(BASE_URL);
    this.bufferedMessages = [];
    this.id = 1;
    this.init();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new WSClient();
    }
    return this.instance;
  }

  init() {
    this.ws.onopen = () => {
      this.initialized = true;
      this.bufferedMessages.forEach((message) => {
        this.ws.send(JSON.stringify(message));
      });
      this.bufferedMessages = [];
    };
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const type = message.e;
      //   console.log(message);
      if (this.callbacks[type]) {
        if (type === "24hrTicker") {
          this.callbacks[type].forEach((xx) => {
            const newTicker: Partial<Ticker> = {
              highPrice: message.h,
              lowPrice: message.l,
              volume: message.v,
              symbol: message.s,
              lastPrice: message.c,
              quoteVolume: message.q,
              priceChange: message.p,
              priceChangePercent: message.P,
            };

            xx.callback(newTicker);
          });
        } else if (type === "depthUpdate") {
          this.callbacks[type].forEach((xx) => {
            const newDepth: Depth = {
              bids: message.b,
              asks: message.a,
              lastUpdateId: message.lastUpdateId,
            };

            xx.callback(newDepth);
          });
        } else if (type === "trade") {
          this.callbacks[type].forEach((xx) => {
            const newTrade: Trade = {
              id: message.t,
              isBuyerMaker: message.m,
              price: message.p,
              qty: message.q,
              time: message.E,
            };
            console.log(newTrade);

            xx.callback(newTrade);
          });
        }
      }
    };
  }

  sendMessage(message: any) {
    const newMessage = {
      ...message,
      id: this.id++,
    };
    if (!this.initialized) {
      this.bufferedMessages.push(newMessage);
      return;
    }
    this.ws.send(JSON.stringify(newMessage));
  }

  //registering the callbacks as only have one ws connection, so would perform tasks based on this even "type"
  registerCallBack(type: string, callback: any, id: string) {
    this.callbacks[type] = this.callbacks[type] || [];
    this.callbacks[type].push({
      callback,
      id,
    });
  }

  //deregistering, will be used in the cleanup of useEffect
  deRegisterCallBack(type: string, id: string) {
    const idx = this.callbacks[type].findIndex((xx) => xx.id === id);
    if (idx !== -1) {
      this.callbacks[type].splice(idx, 1);
    }
  }
}
