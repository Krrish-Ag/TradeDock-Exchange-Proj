import { createClient } from "redis";
import { Engine } from "./logic/Engine";

async function main() {
  const redisClient = createClient();
  redisClient.connect();
  const engine = new Engine();

  while (true) {
    const response = await redisClient.brPop("messages", 0);
    console.log("RESPONSE", response);
    if (response) {
      console.log("Motiv to do smth");
      engine.process(JSON.parse(response.element));
    } else {
    }
  }
}

main();
