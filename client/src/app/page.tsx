import Link from "next/link";
import { supportedMarkets } from "./utils/data";

//list of markets

export default function Home() {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 w-400 gap-4 p-8">
        {supportedMarkets.map((market) => (
          <Link key={market.name} href={`trade/${market.name}`}>
            <div className="bg-gray-800 p-10 h-40 rounded-lg flex gap-10 items-center space-x-4 cursor-pointer hover:bg-gray-700 transition-colors duration-200">
              <img
                src={market.icon}
                alt={market.base}
                className="w-20 h-20 rounded-full"
              />
              <div className="flex flex-col gap-3">
                <p className="text-2xl lg:text-3xl font-bold text-white">
                  {market.base} / {market.quote}
                </p>
                <p className="text-gray-400">Trade Now &rarr;</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
