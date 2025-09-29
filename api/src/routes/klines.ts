import { Client } from "pg";
import express from "express";

const pgClient = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "mypass",
  port: 5432,
});
pgClient.connect();

const kLinesRouter = express.Router();

kLinesRouter.get("/", async (req, res) => {
  const { market, interval, startTime, endTime } = req.query;
  let query;
  switch (interval) {
    case "1m":
      query = "SELECT * FROM klines_1m WHERE bucket>=$1 AND bucket<=$2";
      break;
    case "1d":
      query = "SELECT * FROM klines_1d WHERE bucket>=$1 AND bucket<=$2";
      break;
    case "1w":
      query = "SELECT * FROM klines_1w WHERE bucket>=$1 AND bucket<=$2";
      break;
    default:
      res.status(400).json("Invalid Interval");
  }

  try {
    //@ts-ignore
    const result = await pgClient.query(query, [
      new Date(Number(startTime) * 1000),
      new Date(Number(endTime) * 1000),
    ]);
    res.json(
      (result.rows as any[]).map((x: any) => ({
        close: x.close,
        end: x.bucket,
        high: x.high,
        low: x.low,
        open: x.open,
        quoteVolume: x.quoteVolume,
        start: x.start,
        trades: x.trades,
        volume: x.volume,
      }))
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
