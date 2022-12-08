const http = require("http");
const { backupAll } = require("./backup");
const { restoreAll } = require("./restore");

const hostname = "localhost";
const port = 8080;

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    });
    res.end();
  } else {
    if (req.url === "/") {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      };
      res.writeHead(200, headers);
      res.end("BACKUP AND RESTORE SERVER FOR ANNIE");
      return;
    }

    let success = false;
    if (req.url === "/backupAll") {
      console.log("got backup request\n");
      success = await backupAll();
    }

    if (req.url === "/restoreAll") {
      console.log("got restore request\n");
      success = await restoreAll();
    }

    console.log("\nDone\n");

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    };
    res.writeHead(200, headers);
    res.end(JSON.stringify({ success: success }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
