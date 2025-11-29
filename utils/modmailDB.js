// utils/modmailDB.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const dataDir = path.join(__dirname, "../data");
const dbPath = path.join(dataDir, "modmail.json");

// Ensures folder & file exist
function ensure() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify({ tickets: {} }, null, 2),
      "utf8"
    );
  }
}

// Load DB safely
function loadDB() {
  ensure();
  try {
    const raw = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(raw);
  } catch {
    // Reset DB if corrupted
    const safe = { tickets: {} };
    fs.writeFileSync(dbPath, JSON.stringify(safe, null, 2), "utf8");
    return safe;
  }
}

// Save DB
function saveDB(db) {
  ensure();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
}

// -------------------
// Public Functions
// -------------------

export function getTicket(userId) {
  const db = loadDB();
  return db.tickets[userId] || null;
}

export function setTicket(userId, channelId) {
  const db = loadDB();
  db.tickets[userId] = channelId;
  saveDB(db);
}

export function removeTicket(userId) {
  const db = loadDB();
  delete db.tickets[userId];
  saveDB(db);
}

export function findTicketOwner(channelId) {
  const db = loadDB();
  return Object.entries(db.tickets)
    .find(([userId, chId]) => String(chId) === String(channelId))
    ?.at(0) || null;
}
