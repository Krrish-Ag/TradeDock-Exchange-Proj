import { useEffect, useRef } from "react";
import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/httpClient";
import { KLine } from "../utils/types";

export function TradeView({ market }: { market: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager>(null);

  const init = async () => {
    let klineData: KLine[] = [];
    try {
      klineData = await getKlines(
        market,
        "1h",
        Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000),
        Math.floor(new Date().getTime() / 1000)
      );
    } catch (e) {
      console.log("ERROR", e);
    }

    if (chartRef) {
      if (chartManagerRef.current) {
        chartManagerRef.current.destroy();
      }
      const chartManager = new ChartManager(
        chartRef.current,
        [
          ...klineData?.map((x) => ({
            close: +x[4], //got to know these indices from binance docs: https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Kline-Candlestick-Data
            high: +x[2],
            low: +x[3],
            open: +x[1],
            timestamp: x[0],
          })),
        ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
        {
          background: "#0e0f14",
          color: "white",
        }
      );
      chartManagerRef.current = chartManager;
    }
  };

  useEffect(() => {
    init();
  }, [market, chartRef]);

  return (
    <>
      <div
        ref={chartRef}
        style={{ height: "520px", width: "100%", marginTop: 4 }}
      ></div>
    </>
  );
}
