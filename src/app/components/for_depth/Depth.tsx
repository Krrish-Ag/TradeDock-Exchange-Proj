"use client";

import { useEffect, useState } from "react";
import { getDepth, getTicker } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { WSClient } from "@/app/utils/RealTimeUtil";
import { Depth, Ticker } from "@/app/utils/types";

export function Depth({ market }: { market: string }) {
  const [bids, setBids] = useState<[string, string][]>();
  const [asks, setAsks] = useState<[string, string][]>();
  const [price, setPrice] = useState<string>();

  useEffect(() => {
    getDepth(market).then((d) => {
      setBids(d.bids.reverse());
      setAsks(d.asks);
    });

    getTicker(market).then((t) => setPrice(t.lastPrice));

    WSClient.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`${market.toLowerCase()}@depth`],
    });
    WSClient.getInstance().registerCallBack(
      "depthUpdate",
      (data: Depth) => {
        setBids((prev) => data.bids ?? prev ?? []);
        setAsks((prev) => data.asks ?? prev ?? []);
      },
      `depth-${market}`
    );

    //for the last price
    WSClient.getInstance().registerCallBack(
      "24hrTicker", //this type chosen as this is the type in the event.data.e is what we get
      (data: Partial<Ticker>) =>
        setPrice((prevPrice) => data?.lastPrice ?? prevPrice ?? ""),
      `TICKER-${market}`
    );

    return () => {
      WSClient.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`${market.toLowerCase()}@depth`],
      });
      WSClient.getInstance().deRegisterCallBack(
        "depthUpdate",
        `depth-${market}`
      );
      WSClient.getInstance().deRegisterCallBack(
        "24hrTicker",
        `TICKER-${market}`
      );
    };
  }, [market]);

  return (
    <div>
      <TableHeader />
      {asks && <AskTable asks={asks} />}
      {price && <div>{price}</div>}
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
