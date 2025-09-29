import { Client } from "pg";
import { createClient } from "redis";

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
      const message = JSON.parse(response.element);
      console.log("MESSAgE", message);
    }
  }
}

main();
