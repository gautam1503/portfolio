// Stores contact messages in MongoDB when MONGODB_URI is set, otherwise in a local JSON file.
const fs = require("fs/promises");
const path = require("path");

// Vercel's filesystem is read-only except /tmp (which is wiped between cold starts), so use MongoDB there for durable storage.
const FILE = process.env.VERCEL ? "/tmp/messages.json" : path.join(__dirname, "..", "data", "messages.json");
let collection = null;
let writeQueue = Promise.resolve();

async function mongo() {
  if (!process.env.MONGODB_URI) return null;
  if (collection) return collection;
  const { MongoClient } = require("mongodb");
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  collection = client.db(process.env.MONGODB_DB || "portfolio").collection("messages");
  return collection;
}

async function readFile() {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function save(message) {
  const col = await mongo();
  if (col) return col.insertOne({ ...message });
  // Serialise file writes so concurrent requests don't overwrite each other.
  writeQueue = writeQueue.then(async () => {
    const all = await readFile();
    all.push(message);
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(all, null, 2));
  });
  return writeQueue;
}

async function list() {
  const col = await mongo();
  if (col) return col.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(500).toArray();
  return (await readFile()).reverse();
}

module.exports = { save, list };
