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

export const tradesRouter = Router();

tradesRouter.get("/", async (req, res) => {
  const { symbol } = req.query;
  // getting from DB
  const query = "SELECT * FROM tata_prices WHERE market=$1";
  const response = await pgClient.query(query, [symbol]);
  res.json(response.rows);
});
