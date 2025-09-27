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
            side: "buy" as ("buy" | "sell"),
            userId: "1"
        };
        const { fills, executedQty } = orderbook.addOrder(order);
        expect(fills.length).toBe(0);
        expect(executedQty).toBe(0);
    });

    it("Can be partially filled", () => {
        const orderbook = new OrderBook("TATA", [{
            price: 1000,
            quantity: 1,
            orderId: "1",
            filled: 0,
            side: "buy" as ("buy" | "sell"),
            userId: "1"
        }], [], 0, 0);

        const order = {
            price: 1000,
            quantity: 2,
            orderId: "2",
            filled: 0,
            side: "sell" as ("buy" | "sell"),
            userId: "2"
        };

        const { fills, executedQty } = orderbook.addOrder(order);
        expect(fills.length).toBe(1);
        expect(executedQty).toBe(1);
    });

    
});