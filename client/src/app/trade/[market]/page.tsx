"use client";
import { MarketBar } from "@/app/components/MarketBar";
import { SwapUI } from "@/app/components/SwapUi";
import { TradeView } from "@/app/components/TradeView";
import { Trades } from "@/app/components/Trades";
import { Depth } from "@/app/components/for_depth/Depth";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { market }: { market: string } = useParams();

  //to replace the _, as binance needs no _, but I need that for images
  // const marketName = market.replace("_", "") || "";

  const [activeTab, setActiveTab] = useState<string>("Book");

  return (
    <div className="flex flex-row flex-1">
      <div className="flex flex-col flex-1">
        <MarketBar market={market} />
        <div className="flex h-[620px] border-y border-slate-800">
          <div className="flex flex-col flex-1">
            <TradeView market={market} />
          </div>
          <div className="w-[1px] flex-col border-slate-800 border-l"></div>
          <div className="p-2 flex flex-col gap-2 w-[250px] overflow-hidden">
            <div className="flex gap-4">
              <div
                className={`${
                  activeTab === "Book" ? "bg-gray-700" : "text-slate-400"
                } hover:bg-gray-800 py-1 px-2 rounded-lg cursor-pointer`}
                onClick={() => setActiveTab("Book")}
              >
                Book
              </div>
              <div
                className={`${
                  activeTab === "Trades" ? "bg-gray-700" : "text-slate-400"
                } hover:bg-gray-800 py-1 px-2 rounded-lg cursor-pointer`}
                onClick={() => setActiveTab("Trades")}
              >
                Trades
              </div>
            </div>
            {activeTab === "Book" ? (
              <Depth market={market} />
            ) : (
              <Trades market={market} />
            )}
          </div>
        </div>
      </div>
      <div className="w-[1px] flex-col border-slate-800 border-l"></div>
      <div>
        <div className="flex flex-col w-[250px]">
          <SwapUI market={market} />
        </div>
      </div>
    </div>
  );
}
