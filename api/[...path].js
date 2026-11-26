process.env.VERCEL = process.env.VERCEL || "1";
const { handle, initialize } = require("../server");

module.exports = async function apiHandler(req, res) {
  try {
    await initialize({ requireDatabase: true });
    await handle(req, res);
  } catch (error) {
    console.error("Vercel API initialization failed:", error.message);
    if (!res.headersSent) {
      res.writeHead(500, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      });
    }
    res.end(JSON.stringify({ error: "Backend is not configured. Check Vercel environment variables and database connection." }));
  }
};
