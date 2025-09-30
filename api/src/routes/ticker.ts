import { Router } from "express";
import { Client } from "pg";

const pgClient = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "mypass",
  port: 5432,
});
pgClient.connect();

export const tickerRouter = Router();

tickerRouter.get("/", async (req, res) => {
  const { symbol } = req.query;
  //getting from db
  const query = "SELECT * FROM tata_prices WHERE TRIM(market)=$1";
  const response = await pgClient.query(query, [symbol]);
  const lastRow = response.rows[response.rows.length - 1];
  res.json({ lastPrice: lastRow.price });
});
