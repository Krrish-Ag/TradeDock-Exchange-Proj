import { describe, expect, it } from "vitest";
import { OrderBook } from "../logic/OrderBook";

describe("Simple orders", () => {
  it("Empty orderbook should not be filled", () => {
    const orderbook = new OrderBook("TATA", [], [], 0, 0);
    const order = {
      price: 1000,
      quantity: 1,
      orderId: "1",
      filled: 0,
      side: "buy" as "buy" | "sell",
      userId: "1",
    };
    const { fills, executedQty } = orderbook.addOrder(order);
    expect(fills.length).toBe(0);
    expect(executedQty).toBe(0);
  });

  it("Can be partially filled", () => {
    const orderbook = new OrderBook(
      "TATA",
      [
        {
          price: 1000,
          quantity: 1,
          orderId: "1",
          filled: 0,
          side: "buy" as "buy" | "sell",
          userId: "1",
        },
      ],
      [],
      0,
      0
    );

    const order = {
      price: 1000,
      quantity: 2,
      orderId: "2",
      filled: 0,
      side: "sell" as "buy" | "sell",
      userId: "2",
    };

    const { fills, executedQty } = orderbook.addOrder(order);
    expect(fills.length).toBe(1);
    expect(executedQty).toBe(1);
  });

  //this one also checks that the previous order if fulfilled is deleted & the new order if not fulfilled, gets added in orderbook
  it("Can be partially filled", () => {
    const orderbook = new OrderBook(
      "TATA",
      [
        {
          price: 999,
          quantity: 1,
          orderId: "1",
          filled: 0,
          side: "buy" as "buy" | "sell",
          userId: "1",
        },
      ],
      [
        {
          price: 1001,
          quantity: 1,
          orderId: "2",
          filled: 0,
          side: "sell" as "buy" | "sell",
          userId: "2",
        },
      ],
      0,
      0
    );

    const order = {
      price: 1001,
      quantity: 2,
      orderId: "3",
      filled: 0,
      side: "buy" as "buy" | "sell",
      userId: "3",
    };

    const { fills, executedQty } = orderbook.addOrder(order);
    expect(fills.length).toBe(1);
    expect(executedQty).toBe(1);
    expect(orderbook.bids.length).toBe(2);
    expect(orderbook.asks.length).toBe(0);
  });
});

//same userID cannot complete the trade ofc
describe("Self trade prevention", () => {
  it("User cant self trade", () => {
    const orderbook = new OrderBook(
      "TATA",
      [
        {
          price: 999,
          quantity: 1,
          orderId: "1",
          filled: 0,
          side: "buy" as "buy" | "sell",
          userId: "1",
        },
      ],
      [
        {
          price: 1001,
          quantity: 1,
          orderId: "2",
          filled: 0,
          side: "sell" as "buy" | "sell",
          userId: "2",
        },
      ],
      0,
      0
    );

    const order = {
      price: 999,
      quantity: 2,
      orderId: "3",
      filled: 0,
      side: "sell" as "buy" | "sell",
      userId: "1",
    };

    const { fills, executedQty } = orderbook.addOrder(order);
    expect(fills.length).toBe(0);
    expect(executedQty).toBe(0);
  });
});

describe("Decimal precision errors are taken care of", () => {
  it("Bid gets eatun up persist even with decimal quantities", () => {
    const orderbook = new OrderBook(
      "TATA",
      [
        {
          price: 999,
          quantity: 0.551123,
          orderId: "1",
          filled: 0,
          side: "buy" as "buy" | "sell",
          userId: "1",
        },
      ],
      [
        {
          price: 1001,
          quantity: 0.551,
          orderId: "2",
          filled: 0,
          side: "sell" as "buy" | "sell",
          userId: "2",
        },
      ],
      0,
      0
    );

    const order = {
      price: 999,
      quantity: 0.551123,
      orderId: "3",
      filled: 0,
      side: "sell" as "buy" | "sell",
      userId: "3",
    };

    const { fills, executedQty } = orderbook.addOrder(order);
    expect(fills.length).toBe(1);
    expect(orderbook.bids.length).toBe(0);
    expect(orderbook.asks.length).toBe(1);
  });
});
