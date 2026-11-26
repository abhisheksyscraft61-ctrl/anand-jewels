const assert = require("node:assert/strict");
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const net = require("node:net");
const { after, before, test } = require("node:test");

const root = path.resolve(__dirname, "..");
const password = "test-admin-password-123";
let server;
let origin;
let cookie;
let temporaryDirectory;
let dataFile;

async function unusedPort() {
  const listener = net.createServer();
  await new Promise(resolve => listener.listen(0, "127.0.0.1", resolve));
  const { port } = listener.address();
  await new Promise(resolve => listener.close(resolve));
  return port;
}

async function api(url, options = {}) {
  return fetch(`${origin}${url}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.auth ? { Cookie: cookie } : {}),
      ...(options.method && options.method !== "GET" ? { Origin: origin } : {}),
      ...options.headers
    }
  });
}

before(async () => {
  temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "anand-jewels-test-"));
  dataFile = path.join(temporaryDirectory, "site-data.json");
  const port = await unusedPort();
  origin = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, [path.join(root, "server.js")], {
    cwd: root,
    env: {
      ...process.env,
      ADMIN_EMAIL: "admin@example.com",
      ADMIN_PASSWORD: password,
      DATABASE_URL: "",
      DATA_FILE: dataFile,
      PORT: String(port)
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let startupError = "";
  server.stderr.on("data", chunk => { startupError += chunk; });
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Backend exited during startup: ${startupError}`);
    try {
      const response = await fetch(`${origin}/api/health`);
      if (response.ok) return;
    } catch (error) {
      if (error.cause?.code !== "ECONNREFUSED" && error.cause?.code !== "ECONNRESET") throw error;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error(`Backend did not start: ${startupError}`);
});

after(async () => {
  if (server && server.exitCode === null) {
    server.kill("SIGTERM");
    await new Promise(resolve => server.once("exit", resolve));
  }
  if (temporaryDirectory) await fs.rm(temporaryDirectory, { recursive: true, force: true });
});

test("serves the public site and the admin panel", async () => {
  const [site, panel, adminStyle, adminScript, protectedSummary] = await Promise.all([
    fetch(origin),
    fetch(`${origin}/admin`),
    fetch(`${origin}/admin.css`),
    fetch(`${origin}/admin.js`),
    api("/api/admin/summary")
  ]);
  assert.equal(site.status, 200);
  assert.match(await site.text(), /Beautiful Jewels at Honest Prices/);
  assert.equal(panel.status, 200);
  assert.match(await panel.text(), /PRIVATE ADMINISTRATION/);
  assert.equal(adminStyle.headers.get("content-type"), "text/css; charset=utf-8");
  assert.equal(adminScript.headers.get("content-type"), "text/javascript; charset=utf-8");
  assert.equal(protectedSummary.status, 401);
});

test("authenticates admins and persists managed content and enquiries", async () => {
  const rejected = await api("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email: "admin@example.com", password: "wrong-password" })
  });
  assert.equal(rejected.status, 401);

  const login = await api("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email: "admin@example.com", password })
  });
  assert.equal(login.status, 200);
  cookie = login.headers.get("set-cookie").split(";")[0];

  const content = await (await api("/api/admin/content", { auth: true })).json();
  content.settings.tagline = "Jewels made for every story";
  content.about.paragraphs.push("A new paragraph added in the admin panel.");
  content.collection.stories.push({
    name: "SILVER",
    title: "Made for every day.",
    cta: "Explore Silver Jewellery",
    image: "silver-collection.jpg",
    alt: "Silver jewellery",
    paragraphs: ["A new editorial collection story."]
  });
  content.insights.articles[0].body = "Updated article copy.";
  content.policies[0].body = "Updated policy copy.";
  const savedContent = await api("/api/admin/content", {
    method: "PUT", auth: true, body: JSON.stringify(content)
  });
  const savedContentBody = await savedContent.json();
  assert.equal(savedContent.status, 200, savedContentBody.error);
  const publicContent = (await (await api("/api/public/catalog")).json()).content;
  assert.equal(publicContent.settings.tagline, "Jewels made for every story");
  assert.equal(publicContent.about.paragraphs.at(-1), "A new paragraph added in the admin panel.");
  assert.equal(publicContent.collection.stories.length, content.collection.stories.length);
  assert.equal(publicContent.insights.articles[0].body, "Updated article copy.");
  assert.equal(publicContent.policies[0].body, "Updated policy copy.");

  const createDesign = await api("/api/admin/designs", {
    method: "POST", auth: true,
    body: JSON.stringify({ name: "Test Editorial Design", category: "Necklaces", image: "test-design.jpg" })
  });
  assert.equal(createDesign.status, 201);
  const design = await createDesign.json();
  const updateDesign = await api(`/api/admin/designs/${design.id}`, {
    method: "PUT", auth: true,
    body: JSON.stringify({ ...design, name: "Updated Editorial Design" })
  });
  assert.equal((await updateDesign.json()).name, "Updated Editorial Design");
  assert.ok((await (await api("/api/public/catalog")).json()).designs.some(item => item.name === "Updated Editorial Design"));
  const deleteDesign = await api(`/api/admin/designs/${design.id}`, { method: "DELETE", auth: true });
  assert.equal(deleteDesign.status, 200);

  const newProduct = {
    name: "Test Gold Ring",
    category: "Rings",
    metal: "Gold",
    purity: 22,
    weight: 5.5,
    stone: "None",
    image: "solitaire-ring.jpg",
    featured: true
  };
  const createProduct = await api("/api/admin/products", {
    method: "POST", auth: true, body: JSON.stringify(newProduct)
  });
  assert.equal(createProduct.status, 201);
  const product = await createProduct.json();
  assert.equal(product.name, newProduct.name);

  const updatedProduct = await api(`/api/admin/products/${product.id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify({ ...newProduct, name: "Updated Test Gold Ring" })
  });
  assert.equal((await updatedProduct.json()).name, "Updated Test Gold Ring");

  const catalog = await (await api("/api/public/catalog")).json();
  assert.ok(catalog.products.some(item => item.id === product.id));

  const createShowroom = await api("/api/admin/showrooms", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ name: "Test & Showroom", address: "Main Road, Bhopal", hours: "Daily, 10 AM – 8 PM", phone: "+911234567890", image: "" })
  });
  assert.equal(createShowroom.status, 201);
  const showroom = await createShowroom.json();
  const updatedShowroom = await api(`/api/admin/showrooms/${showroom.id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify({ ...showroom, name: "Updated & Showroom" })
  });
  assert.equal((await updatedShowroom.json()).name, "Updated & Showroom");
  assert.ok((await (await api("/api/public/catalog")).json()).showrooms.some(item => item.name === "Updated & Showroom"));

  const submission = await api("/api/public/enquiries", {
    method: "POST",
    body: JSON.stringify({ name: "Test Customer", phone: "+911234567890", email: "customer@example.com", message: "Interested in a ring", product: product.name })
  });
  assert.equal(submission.status, 201);
  const enquiries = await (await api("/api/admin/enquiries", { auth: true })).json();
  const enquiry = enquiries.find(item => item.name === "Test Customer");
  assert.ok(enquiry);

  const statusChange = await api(`/api/admin/enquiries/${enquiry.id}`, {
    method: "PATCH", auth: true, body: JSON.stringify({ status: "Contacted" })
  });
  assert.equal(statusChange.status, 200);
  assert.equal((await statusChange.json()).status, "Contacted");

  const stored = JSON.parse(await fs.readFile(dataFile, "utf8"));
  assert.ok(stored.products.some(item => item.id === product.id));
  assert.equal(stored.content.settings.tagline, "Jewels made for every story");
  assert.equal(stored.enquiries.find(item => item.id === enquiry.id).status, "Contacted");

  const deleted = await api(`/api/admin/products/${product.id}`, { method: "DELETE", auth: true });
  assert.equal(deleted.status, 200);
});

test("rejects invalid public enquiries and invalid product data", async () => {
  const invalidEnquiry = await api("/api/public/enquiries", {
    method: "POST",
    body: JSON.stringify({ name: "Customer", phone: "bad", email: "not-an-email" })
  });
  assert.equal(invalidEnquiry.status, 400);

  const invalidProduct = await api("/api/admin/products", {
    method: "POST", auth: true,
    body: JSON.stringify({ name: "Invalid Piece", category: "Rings", metal: "Gold", purity: -1, weight: 2 })
  });
  assert.equal(invalidProduct.status, 400);
});

test("Vercel API refuses to use temporary storage without PostgreSQL", () => {
  const script = `
    const handler = require("./api/[...path].js");
    const response = {
      headersSent: false,
      writeHead(status, headers) { this.status = status; this.headers = headers; this.headersSent = true; },
      end(body) { this.body = body; }
    };
    handler({ method: "GET", url: "/api/health", headers: {} }, response).then(() => {
      process.stdout.write(String(response.status) + ":" + response.body);
      process.exitCode = response.status === 500 ? 0 : 1;
    });
  `;
  const result = spawnSync(process.execPath, ["-e", script], {
    cwd: root,
    env: { ...process.env, VERCEL: "1", ADMIN_EMAIL: "admin@example.com", ADMIN_PASSWORD: password, DATABASE_URL: "" },
    encoding: "utf8"
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /^500:.*Backend is not configured/);
});
