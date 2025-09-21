import { BASE_CURRENCY } from "./Engine";

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
  tradeId: number;
  markerOrderId: string;
}

export class OrderBook {
  bids: Order[];
  asks: Order[];
  baseAsset: string;
  quoteAsset: string = BASE_CURRENCY;
  lastTradeId: number;
  currentPrice: number;

  constructor(
    baseAsset: string,
    bids: Order[],
    asks: Order[],
    lastTradeId: number,
    currentPrice: number
  ) {
    this.bids = bids;
    this.asks = asks;
    this.baseAsset = baseAsset;
    this.lastTradeId = lastTradeId || 0;
    this.currentPrice = currentPrice || 0;
  }

  ticker() {
    return `${this.baseAsset}_${this.quoteAsset}`;
  }

  getSnapShot() {
    return {
      bids: this.bids,
      asks: this.asks,
      baseAsset: this.baseAsset,
      currentPrice: this.currentPrice,
      lastTradeId: this.lastTradeId,
    };
  }

  matchBid(order: Order) {
    const fills: Fill[] = [];
    let executedQty = 0;

    for (let i = 0; i < this.asks.length; i++) {
      if (executedQty < order.quantity && order.price < this.asks[i].price) {
        const quantityGiven = Math.min(
          order.quantity - executedQty,
          this.asks[i].quantity
        );
        executedQty += quantityGiven;
        this.asks[i].filled += quantityGiven;

        fills.push({
          price: this.asks[i].price,
          qty: quantityGiven,
          tradeId: this.lastTradeId++,
          otherUserId: this.asks[i].userId,
          markerOrderId: this.asks[i].orderId,
        });
      }
    }

    for (let i = 0; i < this.asks.length; i++) {
      if (this.asks[i].filled === this.asks[i].quantity) {
        this.asks.splice(i, 1);
        i--;
      }
    }

    return {
      fills,
      executedQty,
    };
  }

  matchAsk(order: Order) {
    const fills: Fill[] = [];
    let executedQty = 0;

    for (let i = 0; i < this.bids.length; i++) {
      if (executedQty < order.quantity && order.price < this.bids[i].price) {
        const quantityTaken = Math.min(
          order.quantity - executedQty,
          this.bids[i].quantity
        );
        executedQty += quantityTaken;
        this.bids[i].filled += quantityTaken;

        fills.push({
          price: this.bids[i].price,
          qty: quantityTaken,
          tradeId: this.lastTradeId++,
          otherUserId: this.bids[i].userId,
          markerOrderId: this.bids[i].orderId,
        });
      }
    }

    for (let i = 0; i < this.bids.length; i++) {
      if (this.bids[i].filled === this.bids[i].quantity) {
        this.bids.splice(i, 1);
        i--;
      }
    }

    return {
      fills,
      executedQty,
    };
  }
}
