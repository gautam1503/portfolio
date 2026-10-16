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
        connectSrc: ["'self'"]
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

  // Email is best effort: the message is already stored.
  mailer.notify(message).catch((err) => console.error("Email notification failed:", err.message));

  res.status(201).json({ ok: true, id: message.id });
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

app.use(express.static(PUBLIC_DIR, { maxAge: "1h", extensions: ["html"] }));
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
