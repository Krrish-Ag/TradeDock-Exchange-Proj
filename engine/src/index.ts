import { createClient } from "redis";
import { Engine } from "./logic/Engine";

async function main() {
  const redisClient = createClient();
  redisClient.connect();
  const engine = new Engine();

  while (true) {
    const response = await redisClient.rPop("messages");
    if (!response) {
    } else {
      console.log("Motiv to do smth");
      engine.process(JSON.parse(response));
    }
  }
}

main();
