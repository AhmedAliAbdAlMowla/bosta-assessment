"use strict"
const http = require("http");
const app = require("./app/app");
const PORT = process.env.PORT || 5000;


const server = http.createServer(app);

server.listen(PORT, (err) =>
  console.log(err ? err : `Server started on port ${PORT}..✌️✌️`)
);