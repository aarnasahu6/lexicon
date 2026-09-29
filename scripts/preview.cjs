const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../dist");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".ttf": "font/ttf",
  ".png": "image/png",
  ".json": "application/json",
  ".ico": "image/x-icon",
};
if (!fs.existsSync(path.join(root, "index.html"))) {
  console.error("Run pnpm export:web first.");
  process.exit(1);
}
http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    let file = path.resolve(root, "." + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) {
      res.writeHead(403);
      return res.end();
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory())
      file = path.join(root, "index.html");
    res.setHeader(
      "Content-Type",
      types[path.extname(file)] || "application/octet-stream",
    );
    fs.createReadStream(file)
      .on("error", () => {
        res.statusCode = 500;
        res.end();
      })
      .pipe(res);
  })
  .listen(8081, "127.0.0.1", () =>
    console.log("Lexicon: http://localhost:8081"),
  );
