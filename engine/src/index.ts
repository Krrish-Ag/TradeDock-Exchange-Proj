import { createClient } from "redis";

function main() {
  const redisClient = createClient();
  redisClient.connect();
  const engine = new Engine();

  while (true) {
    const response = redisClient.brPop("messages", 0);
    if (!response) {
    } else {
      console.log("Motiv to do smth");
      engine.process(JSON.parse(response));
    }
  }
}

main();
