export interface Order {
  price: number;
  quantity: number;
  orderId: string;
  userId: string;
  side: "buy" | "sell";
  filled: number;
}

export interface Fill {
  price: number;
  qty: number;
  otherUserId: string;
  tradeId: string;
  markerOrderId: string;
}

export class OrderBook {
  bids: Order[];
  asks: Order[];

  constructor() {
    this.bids = [];
    this.asks = [];
  }
}
