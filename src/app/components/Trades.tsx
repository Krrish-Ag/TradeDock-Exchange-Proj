"use client";

import { useEffect, useState } from "react";
import { WSClient } from "@/app/utils/RealTimeUtil";
import { Trade } from "@/app/utils/types";
import { TradeTable } from "./for_trade/TradeTable";
import { getTrades } from "../utils/httpClient";

export function Trades({ market }: { market: string }) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    getTrades(market).then((d) => {
      setTrades(d);
    });

    // WSClient.getInstance().sendMessage({
    //   method: "SUBSCRIBE",
    //   params: [
    //     `${market.toLowerCase()}@trade`,
    //     // `${market.toLowerCase()}@depth`,
    //   ],
    // });

    //for the latest price in trades
    WSClient.getInstance().registerCallBack(
      "trade",
      (data: Trade) => {
        setTrades((prev) => {
          if (prev.length > 0 && prev[0].id === data.id) return prev;
          const newTrades = [...prev];
          console.log(data);
          newTrades?.unshift({
            id: data.id ?? "",
            isBuyerMaker: data.isBuyerMaker ?? "",
            price: data.price ?? "",
            qty: data.qty ?? "",
            time: data.time ?? "",
          });
          // newTrades.slice(0, 20);
          return newTrades;
        });
      },
      `trade-${market}`
    );

    //for the last price

    // WSClient.getInstance().registerCallBack(
    //   "24hrTicker", //this type chosen as this is the type in the event.data.e is what we get
    //   (data: Partial<Ticker>) =>
    //     setPrice((prevPrice) => data?.lastPrice ?? prevPrice ?? ""),
    //   `TICKER-${market}`
    // );

    return () => {
      // WSClient.getInstance().sendMessage({
      //   method: "UNSUBSCRIBE",
      //   params: [`${market.toLowerCase()}@trade`],
      // });
      // WSClient.getInstance().deRegisterCallBack("trade", `trade-${market}`);
    };
  }, [market]);

  return (
    <div className="overflow-y-auto no-scrollbar">
      <TableHeader />
      {trades && <TradeTable trades={trades.slice(0, 150)} />}
    </div>
  );
}

function TableHeader() {
  return (
    <div className="flex justify-between">
      <div className="text-white">Price</div>
      <div className="text-slate-500">Qty</div>
      <div className="text-slate-500">TimeStamp</div>
    </div>
  );
}
