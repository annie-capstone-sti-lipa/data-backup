const http = require("http");
const { execSync } = require("child_process");
const { backupAll } = require("./backup");

const hostname = "localhost";
const port = 3000;

const server = http.createServer(async (req, res) => {
  let success = false;
  if (req.url === "/backupAll") {
    success = await backupAll();
  }

  if (req.url === "/restoreAll") {
    execSync("node backup all");
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ success: success }));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
