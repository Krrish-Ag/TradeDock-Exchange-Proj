import { Client } from "pg";
import { createClient } from "redis";
import { DbMessage } from "./types";

const pgClient = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "mypass",
  port: 5432,
});
pgClient.connect();

async function main() {
  const redisClient = createClient();
  await redisClient.connect();
  console.log("CONNECTED to REDIS");

  while (true) {
    const response = await redisClient.brPop("db_process", 0);
    if (response) {
      const message: DbMessage = JSON.parse(response.element);
      console.log("MESSAgE", message);
      if (message.type === "TRADE_ADDED") {
        console.log("adding data");
        const price = message.data.price;
        const volume = message.data.quantity;
        const currency = message.data.market.split("_")[1];
        const timestamp = new Date(message.data.timestamp);
        const query =
          "INSERT INTO tata_prices (time, price, volume, currency_code) VALUES ($1, $2, $3, $4)";
        // TODO: How to add volume?
        const values = [timestamp, price, volume, currency];
        await pgClient.query(query, values);
      }
    }
  }
}

main();
