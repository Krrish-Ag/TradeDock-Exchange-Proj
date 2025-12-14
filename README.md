Start docker - docker-compose up
Start api - npm run dev
Start engine - npm run dev
Start Websocket - npm run dev
Seed DB - npm run seed:db
Start refreshing db for charts DB - npm run refresh:views
Start db (for redis) - npm run dev
Start client - npm run dev
Can start mm for random trades - npm run dev

Remember your trades and data is storeds in snapshot.json in engine, so for going to default, stop engine, delet snapshot.json file, start engine again.
For a fresh database, like no trades and no charts, stop docker - docker-compose down. Also for a fresh slate remove the volume that docker created
(Remember that stopping docker will also stop the redis, so api & engine & websocket & db will STOP as they need redis up all the time), So need to start them again

AND for mm: can choose any market in the code and then start, it will start filling that market's orderbook.

UserId: 1, Password: 111
UserId: 2, Password: 222
