"use client";
import { MarketBar } from "@/app/components/MarketBar";
import { SwapUI } from "@/app/components/SwapUi";
import { TradeView } from "@/app/components/TradeView";
import { Trades } from "@/app/components/Trades";
import { Depth } from "@/app/components/for_depth/Depth";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { market } = useParams();
  const [activeTab, setActiveTab] = useState<string>("Book");

  return (
    <div className="flex flex-row flex-1">
      <div className="flex flex-col flex-1">
        <MarketBar market={market as string} />
        <div className="flex flex-row h-[620px] border-y border-slate-800">
          <div className="flex flex-col flex-1">
            <TradeView market={market as string} />
          </div>
          <div className="w-[1px] flex-col border-slate-800 border-l"></div>
          <div className="p-2 flex flex-col gap-2 w-[250px] overflow-hidden">
            <div className="flex gap-8">
              <div
                className="bg-gray-700 hover:bg-gray-800 py-1 px-2 rounded-lg cursor-pointer"
                onClick={() => setActiveTab("Book")}
              >
                Book
              </div>
              <div
                className="bg-gray-700 hover:bg-gray-800 py-1 px-2 rounded-lg cursor-pointer"
                onClick={() => setActiveTab("Trades")}
              >
                Trades
              </div>
            </div>
            {activeTab === "Book" ? (
              <Depth market={market as string} />
            ) : (
              <Trades market={market as string} />
            )}
          </div>
        </div>
      </div>
      <div className="w-[1px] flex-col border-slate-800 border-l"></div>
      <div>
        <div className="flex flex-col w-[250px]">
          <SwapUI market={market as string} />
        </div>
      </div>
    </div>
  );
}
