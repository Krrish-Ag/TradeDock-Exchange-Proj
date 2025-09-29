import { Trade } from "../../utils/types";

export function TradeTable({ trades }: { trades: Trade[] }) {
  return trades.map((trade, i) => {
    return (
      // eslint-disable-next-line react/jsx-key
      <div className="grid grid-cols-[3fr_2fr_1fr] w-full">
        <div
          className={`${
            i == trades.length - 1 || trades[i].price > trades[i + 1].price
              ? "text-green-200"
              : "text-red-200"
          } font-semibold`}
        >
          {(+trade.price).toFixed(2)}
        </div>
        <div>{(+trade.volume).toFixed(2)}</div>
        <div>{formatDate(trade.time)}</div>
      </div>
    );
  });
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}
