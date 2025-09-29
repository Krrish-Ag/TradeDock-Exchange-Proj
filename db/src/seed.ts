import { Client } from "pg";

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "mypass",
  port: 5432,
});

async function initializeDB() {
  await client.connect();

  await client.query(`
        DROP TABLE IF EXISTS "tata_prices";
        CREATE TABLE "tata_prices"(
            time            TIMESTAMP WITH TIME ZONE NOT NULL,
            price   DOUBLE PRECISION,
            volume      DOUBLE PRECISION,
            market   VARCHAR (10)
        );
        
        SELECT create_hypertable('tata_prices', 'time', 'price', 2);
    `);

  await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1m AS
        SELECT
            time_bucket('1 minute', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
            market
        FROM tata_prices
        GROUP BY bucket, market;
    `);

  await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1h AS
        SELECT
            time_bucket('1 hour', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
            market
        FROM tata_prices
        GROUP BY bucket, market;
    `);

  await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1w AS
        SELECT
            time_bucket('1 week', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
            market
        FROM tata_prices
        GROUP BY bucket, market;
    `);

  await client.end();
  console.log("Database initialized successfully");
}

initializeDB().catch(console.error);
