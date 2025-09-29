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
      setTrades(d.reverse());
    });

    //for the latest price in trades
    WSClient.getInstance().registerCallBack(
      "trade",
      (data: Trade) => {
        setTrades((prev) => {
          if (prev.length > 0 && prev[0].id === data.id) return prev;
          const newTrades = [...prev];
          newTrades?.unshift({
            id: data.id ?? "",
            isBuyerMaker: data.isBuyerMaker ?? "",
            price: data.price ?? "",
            volume: data.volume ?? "",
            time: data.time ?? "",
          });
          // newTrades.slice(0, 20);
          return newTrades;
        });
      },
      `trade-${market}`
    );

    return () => {};
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
    <div className="grid grid-cols-[4fr_2fr_1fr] w-full">
      <div className="text-white">Price</div>
      <div className="text-slate-500">Qty</div>
      <div className="text-slate-500">TimeStamp</div>
    </div>
  );
}
