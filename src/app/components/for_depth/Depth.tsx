"use client";

import { useEffect, useState } from "react";
import { getDepth, getTicker } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { WSClient } from "@/app/utils/RealTimeUtil";
import { Depth, Ticker } from "@/app/utils/types";

export function Depth({ market }: { market: string }) {
  const [bids, setBids] = useState<[string, string][]>([]);
  const [asks, setAsks] = useState<[string, string][]>([]);
  const [price, setPrice] = useState<string>();

  useEffect(() => {
    getDepth(market).then((d) => {
      setBids(d.bids.reverse());
      setAsks(d.asks);
    });

    getTicker(market).then((t) => setPrice(t.lastPrice));

    WSClient.getInstance().registerCallBack(
      "depthUpdate",
      (data: Depth) => {
        setBids((prev) => {
          const newBids = [];

          //fill the newBids with prev values or new ones if teh quantity is updated
          for (let i = 0; i < prev.length; i++) {
            const idx = data.bids.findIndex(
              ([price, _]) => price === prev[i][0]
            );
            if (idx === -1) newBids.push(prev[i]);
            else {
              if (Number(data.bids[idx][1]) !== 0)
                newBids.push([prev[i][0], data.bids[idx][1]]);
            }
          }

          //fill the new values
          for (let i = 0; i < data.bids.length; i++) {
            const idx = newBids.findIndex(
              ([price, _]) => price === data.bids[i][0]
            );
            if (idx == -1 && Number(data.bids[i][1]) !== 0) {
              newBids.push(data.bids[i]);
            }
          }
          return newBids;
        });

        setAsks((prev) => {
          const newAsks = [];

          //fill the newBids with prev values or new ones if teh quantity is updated
          for (let i = 0; i < prev.length; i++) {
            const idx = data.asks.findIndex(
              ([price, _]) => price === prev[i][0]
            );
            if (idx === -1) newAsks.push(prev[i]);
            else {
              if (Number(data.asks[idx][1]) !== 0)
                newAsks.push([prev[i][0], data.asks[idx][1]]);
            }
          }

          //fill the new values
          for (let i = 0; i < data.asks.length; i++) {
            const idx = newAsks.findIndex(
              ([price, _]) => price === data.asks[i][0]
            );
            if (idx == -1 && Number(data.asks[i][1]) !== 0) {
              newAsks.push(data.asks[i]);
            }
          }

          return newAsks;
        });
      },
      `depth-${market}`
    );

    //for the last price
    //see that I didnt subsribe to ticker here, so it is still getting vals from the MarketBar ticker sub
    WSClient.getInstance().registerCallBack(
      "24hrTicker", //this type chosen as this is the type in the event.data.e is what we get
      (data: Partial<Ticker>) =>
        setPrice((prevPrice) => data?.lastPrice ?? prevPrice ?? ""),
      `TICKER-DEPTH-${market}`
    );

    return () => {};
  }, [market]);

  return (
    <div className="overflow-y-auto no-scrollbar">
      <TableHeader />
      {asks && <AskTable asks={asks} />}
      {price && <div className="text-lg">{(+price).toFixed(2)}</div>}
      {bids && <BidTable bids={bids} />}
    </div>
  );
}

function TableHeader() {
  return (
    <div className="flex justify-between text-xs">
      <div className="text-white">Price</div>
      <div className="text-slate-500">Size</div>
      <div className="text-slate-500">Total</div>
    </div>
  );
}
