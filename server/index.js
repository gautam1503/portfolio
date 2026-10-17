require("dotenv").config();
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const { validateContact } = require("./validate");
const store = require("./store");
const mailer = require("./mailer");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "..", "public");

app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.github.com"]
      }
    }
  })
);
app.use(compression());
app.use(express.json({ limit: "20kb" }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many messages from this network. Please try again in a few minutes or email me directly." }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), mail: mailer.enabled() });
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  const { value, error, spam } = validateContact(req.body);
  if (spam) return res.status(200).json({ ok: true }); // silently drop bots that fill the honeypot
  if (error) return res.status(400).json({ error });

  const message = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    ...value,
    ip: req.ip,
    userAgent: (req.get("user-agent") || "").slice(0, 200),
    createdAt: new Date().toISOString()
  };

  try {
    await store.save(message);
  } catch (err) {
    console.error("Failed to store message:", err);
    return res.status(500).json({ error: "Could not save your message. Please email me directly." });
  }

  // Email is best effort: the message is already stored. Awaited because serverless
  // platforms (Vercel) may freeze the function as soon as the response is sent.
  try {
    await mailer.notify(message);
  } catch (err) {
    console.error("Email notification failed:", err.message);
  }

  res.status(201).json({ ok: true, id: message.id });
});

// Public repos for the "Personal Projects" section, cached so visitors don't hit GitHub's rate limit.
let repoCache = { at: 0, data: null };
app.get("/api/github-repos", async (req, res) => {
  const user = process.env.GITHUB_USER || "gautam1503";
  if (!repoCache.data || Date.now() - repoCache.at > 2 * 60 * 1000) {
    try {
      const headers = { Accept: "application/vnd.github+json", "User-Agent": "portfolio" };
      if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
      const r = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=pushed`, { headers });
      if (!r.ok) throw new Error(`GitHub responded ${r.status}`);
      const repos = await r.json();
      repoCache = {
        at: Date.now(),
        data: repos.map((x) => ({
          name: x.name,
          description: x.description,
          url: x.html_url,
          homepage: x.homepage,
          language: x.language,
          stars: x.stargazers_count,
          forks: x.forks_count,
          fork: x.fork,
          archived: x.archived,
          topics: x.topics || [],
          pushedAt: x.pushed_at
        }))
      };
    } catch (err) {
      console.error("GitHub fetch failed:", err.message);
      if (!repoCache.data) return res.status(502).json({ error: "Could not load GitHub projects" });
    }
  }
  res.set("Cache-Control", "public, max-age=0, s-maxage=120, stale-while-revalidate=60");
  res.json(repoCache.data);
});

// Private inbox: GET /api/messages with header "Authorization: Bearer <ADMIN_TOKEN>"
app.get("/api/messages", async (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  if (!token || req.get("authorization") !== `Bearer ${token}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json(await store.list());
});

app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

// Revalidate on every load (cheap 304s via ETag) so a deploy never mixes old HTML with new JS/CSS.
// Only binary assets like the résumé PDF are cached for a while.
app.use(express.static(PUBLIC_DIR, {
  extensions: ["html"],
  setHeaders(res, filePath) {
    res.setHeader("Cache-Control", /\.(pdf|png|jpe?g|svg|woff2?)$/i.test(filePath) ? "public, max-age=3600" : "no-cache");
  }
}));
app.get("*", (req, res) => res.sendFile(path.join(PUBLIC_DIR, "index.html")));

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON" });
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
  console.log(`Email notifications: ${mailer.enabled() ? "enabled" : "disabled (set SMTP_* in .env)"}`);
});
