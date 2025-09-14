"use client";
import { useEffect, useState } from "react";
import { Ticker } from "../utils/types";
import { getTicker } from "../utils/httpClient";
import Image from "next/image";
import { WSClient } from "../utils/RealTimeUtil";

export const MarketBar = ({ market }: { market: string }) => {
  const [ticker, setTicker] = useState<Ticker | null>(null);

  //this is so that when we mount the Marketbar, we register for the event ticker which then runs the cllback fn which actually expects data Ticker and then updat teh ticker for Marketbar using setTicker
  useEffect(() => {
    getTicker(market).then(setTicker);
    WSClient.getInstance().registerCallBack(
      "24hrTicker", //this type chosen as this is the type in the event.data.e is what we get
      (data: Partial<Ticker>) =>
        setTicker((prevTicker) => ({
          firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? "",
          highPrice: data?.highPrice ?? prevTicker?.highPrice ?? "",
          lastPrice: data?.lastPrice ?? "",
          lowPrice: data?.lowPrice ?? prevTicker?.lowPrice ?? "",
          priceChange: data?.priceChange ?? prevTicker?.priceChange ?? "",
          priceChangePercent:
            data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? "",
          quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? "",
          symbol: data?.symbol ?? prevTicker?.symbol ?? "",
          trades: data?.trades ?? prevTicker?.trades ?? "",
          volume: data?.volume ?? prevTicker?.volume ?? "",
        })),
      `TICKER-${market}`
    );
    console.log(market.toLowerCase());
    WSClient.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [
        `${market.toLowerCase()}@ticker`,
        `${market.toLowerCase()}@trade`,
        `${market.toLowerCase()}@depth`,
      ],
    });

    return () => {
      WSClient.getInstance().deRegisterCallBack(
        "24hrTicker",
        `TICKER-${market}`
      );
      // WSClient.getInstance().sendMessage({
      //   method: "UNSUBSCRIBE",
      //   params: [`${market.toLowerCase()}@ticker`],
      // });
    };
  }, [market]);

  return (
    <div>
      <div className="flex items-center p-2 flex-row relative w-full overflow-hidden border-b border-slate-800">
        <div className="flex items-center justify-between flex-row no-scrollbar overflow-auto pr-4">
          <TickerFn market={market} />
          <div className="flex items-center flex-row space-x-8 pl-4">
            <div className="flex flex-col h-full justify-center">
              <p
                className={`font-medium tabular-nums text-greenText text-md text-green-500`}
              >
                ${ticker?.lastPrice}
              </p>
              <p className="font-medium text-sm tabular-nums">
                ${ticker?.lastPrice}
              </p>
            </div>
            <div className="flex flex-col">
              <p className={`font-medium text-xs text-slate-400`}>24H Change</p>
              <p
                className={` text-sm font-medium tabular-nums leading-5 text-greenText ${
                  Number(ticker?.priceChange) > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {Number(ticker?.priceChange) > 0 ? "+" : ""}{" "}
                {ticker?.priceChange}{" "}
                {Number(ticker?.priceChangePercent)?.toFixed(2)}%
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-xs text-slate-400">24H High</p>
              <p className="text-sm font-medium tabular-nums leading-5 ">
                {Number(ticker?.highPrice).toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-xs text-slate-400">24H Low</p>
              <p className="text-sm font-medium tabular-nums leading-5">
                {Number(ticker?.lowPrice).toFixed(2)}
              </p>
            </div>
            <button
              type="button"
              className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-base text-left"
              data-rac=""
            >
              <div className="flex flex-col">
                <p className="font-medium text-xs text-slate-400">24H Volume</p>
                <p className="mt-1 text-sm font-medium tabular-nums leading-5">
                  {Number(ticker?.volume).toFixed(2)}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function TickerFn({ market }: { market: string }) {
  return (
    <div className="flex gap-4 h-[60px] shrink-0 space-x-4">
      <div className="flex flex-row relative ml-2 -mr-4">
        <Image
          width={100}
          height={100}
          alt="SOL Logo"
          loading="lazy"
          decoding="async"
          data-nimg="1"
          className="z-10 rounded-full h-6 w-6 mt-4 outline-baseBackgroundL1"
          src="/sol.webp"
        />
        <Image
          width={100}
          height={100}
          alt="USDC Logo"
          loading="lazy"
          decoding="async"
          data-nimg="1"
          className="h-6 w-6 -ml-2 mt-4 rounded-full"
          src="/usdc.webp"
        />
      </div>
      <button type="button" className="react-aria-Button" data-rac="">
        <div className="flex items-center justify-between flex-row cursor-pointer rounded-lg p-3 hover:opacity-80">
          <div className="flex items-center flex-row gap-2 undefined">
            <div className="flex flex-row relative">
              <p className="font-medium text-sm undefined">
                {market.replace("_", " / ")}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
