import fs from "fs";
import { OrderBook } from "./OrderBook";
import {
  CANCEL_ORDER,
  CREATE_ORDER,
  GET_OPEN_ORDERS,
  MessageFromApi,
} from "../types/fromApi";
import { RedisManager } from "../RedisManager";

interface UserBalance {
  [key: number]: {
    available: number;
    locked: number;
  };
}

export const QUOTE_CURRENCY = "INR";
const BASE_ASSET = "TATA";

class Engine {
  private orderbooks: OrderBook[] = [];
  private balances: Map<String, UserBalance> = new Map();

  constructor() {}

  saveSnapshot() {
    const snapshotToSave = {
      orderbooks: this.orderbooks.map((xx) => xx.getSnapShot()),
      balances: Array.from(this.balances.entries()),
    };
    fs.writeFileSync("./snapshot.json", JSON.stringify(snapshotToSave));
  }

  process({
    message,
    clientId,
  }: {
    message: MessageFromApi;
    clientId: string;
  }) {
    switch (message.type) {
      case CREATE_ORDER:
        try {
          const { executedQty, fills, orderId } = this.createOrder(
            message.data.market,
            message.data.price,
            message.data.quantity,
            message.data.side,
            message.data.userId
          );

          RedisManager.getInstance().sendToApi(clientId, {
            type: "ORDER_PLACED",
            payload: {
              executedQty,
              fills,
              orderId,
            },
          });
        } catch (error) {
          console.log("ERROR", error);
          RedisManager.getInstance().sendToApi(clientId, {
            type: "ORDER_CANCELLED",
            payload: {
              orderId: "",
              executedQty: 0,
              remainingQty: 0,
            },
          });
        }
        break;
      case CANCEL_ORDER:
        try {
          const orderId = message.data.orderId;
          const cancelMarket = message.data.market;

          const cancelOrderbook = this.orderbooks.find(
            (xx) => xx.ticker() === cancelMarket
          );
          if (!cancelOrderbook) {
            console.log("No orderbook found");
            throw new Error("No orderbook found");
          }

          const order =
            cancelOrderbook?.asks.find((xx) => xx.orderId === orderId) ||
            cancelOrderbook?.bids.find((xx) => xx.orderId === orderId);
          if (!order) {
            console.log("No such order Id found");
            throw new Error("No such order Id found");
          }

          const quoteAsset = cancelMarket.split("_")[1];

          if (order.side === "buy") {
            //change the quote asset
            const leftQuantityPrice =
              (order.quantity - order.filled) * order.price;
            //@ts-ignore
            this.balances.get(order.userId)[quoteAsset].available +=
              leftQuantityPrice;
            //@ts-ignore
            this.balances.get(order.userId)[quoteAsset].locked -=
              leftQuantityPrice;

            const price = cancelOrderbook?.cancelBid(order);
            if (price) {
              this.sendUpdatedDepthAt(price.toString(), cancelMarket);
            }
          } else {
            //only chnage the quantity as dealing with base asset
            const leftQuantityPrice = order.quantity - order.filled;
            //@ts-ignore
            this.balances.get(order.userId)[BASE_ASSET].available +=
              leftQuantityPrice;
            //@ts-ignore
            this.balances.get(order.userId)[BASE_ASSET].locked -=
              leftQuantityPrice;

            const price = cancelOrderbook?.cancelAsk(order);
            if (price) {
              this.sendUpdatedDepthAt(price.toString(), cancelMarket);
            }
          }

          RedisManager.getInstance().sendToApi(clientId, {
            type: "ORDER_CANCELLED",
            payload: {
              orderId,
              remainingQty: 0,
              executedQty: 0,
            },
          });
        } catch (error) {
          console.log("Error while cancelling the order");
          console.log("ERROR", error);
        }
      case GET_OPEN_ORDERS:
        try {
          const openOrderBook = this.orderbooks.find(
            (xx) => xx.ticker() === message.data.market
          );
          if (!openOrderBook) throw new Error("No orderboo/market like that");

          const openOrders = openOrderBook.getOpenOrders(clientId);

          RedisManager.getInstance().sendToApi(clientId, {
            type: "OPEN_ORDERS",
            payload: openOrders,
          });
        } catch (error) {
          console.log("Error while fetching open orders");
          console.log("ERROR", error);
        }
    }
  }
}
