const http = require("http");
const { backupAll } = require("./backup");
const { restoreAll } = require("./restore");

const hostname = "localhost";
const port = 3000;

const server = http.createServer(async (req, res) => {
  let success = false;
  if (req.url === "/backupAll") {
    success = await backupAll();
  }

  if (req.url === "/restoreAll") {
    success = await restoreAll();
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ success: success }));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
