export const BASE_URL = "";

//creating a singleton, as dont want to create numtiple websocket connections
export class WSClient {
  private ws: WebSocket;
  private static instance: WSClient;
  private bufferedMessages: any[] = [];
  private callbacks: any = {};
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
      const message = event.data;
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
