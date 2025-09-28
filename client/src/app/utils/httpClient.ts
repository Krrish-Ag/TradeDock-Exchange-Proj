import axios from "axios";
import { Depth, KLine, Ticker, Trade } from "./types";

// const BASE_URL = "https://api.binance.com/api/v3";
const BASE_URL = "http://localhost:3000/api/v1";

export async function getTicker(market: string): Promise<Ticker> {
  const tickers = await getTickers();
  const ticker = tickers.find((t) => t.symbol === market);
  if (!ticker) {
    throw new Error(`No ticker found for ${market}`);
  }
  return ticker;
}

export async function getTickers(): Promise<Ticker[]> {
  const response = await axios.get(`${BASE_URL}/ticker/24hr`);
  return response.data;
}

export async function getDepth(market: string): Promise<Depth> {
  const response = await axios.get(`${BASE_URL}/depth?symbol=${market}`);
  return response.data;
}
export async function getTrades(market: string): Promise<Trade[]> {
  const response = await axios.get(`${BASE_URL}/trades?symbol=${market}`);
  return response.data;
}

export async function getKlines(
  market: string,
  interval: string,
  startTime: number,
  endTime: number
): Promise<KLine[]> {
  const response = await axios.get(
    `${BASE_URL}/klines?symbol=${market}&interval=${interval}`
  );
  const data: KLine[] = response.data;
  return data.sort((x, y) => Number(x.end) - Number(y.end));
}

// export async function getMarkets(): Promise<string[]> {
//   const response = await axios.get(`${BASE_URL}/markets`);
//   return response.data;
// }
