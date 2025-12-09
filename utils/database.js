import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = './data';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const db = new Database(path.join(dataDir, 'bot.sqlite'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS guild_configs (
    guild_id TEXT PRIMARY KEY,
    prefix TEXT DEFAULT ',',
    log_channel TEXT,
    welcome_channel TEXT,
    welcome_message TEXT,
    level_channel TEXT,
    ticket_category TEXT,
    autorole_id TEXT,
    staff_role TEXT,
    goodbye_channel TEXT,
    goodbye_message TEXT,
    boost_channel TEXT,
    boost_message TEXT,
    voicemaster_channel TEXT,
    voicemaster_category TEXT,
    antinuke_enabled INTEGER DEFAULT 0,
    antiraid_enabled INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT,
    guild_id TEXT,
    balance INTEGER DEFAULT 0,
    bank INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 0,
    last_daily INTEGER DEFAULT 0,
    last_work INTEGER DEFAULT 0,
    last_rob INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, guild_id)
  );

  CREATE TABLE IF NOT EXISTS tickets (
    ticket_id TEXT PRIMARY KEY,
    guild_id TEXT,
    user_id TEXT,
    channel_id TEXT,
    closed INTEGER DEFAULT 0,
    transcript TEXT,
    anonymous INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS economy (
    user_id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 0,
    bank INTEGER DEFAULT 0,
    last_daily INTEGER DEFAULT 0,
    last_work INTEGER DEFAULT 0,
    last_rob INTEGER DEFAULT 0,
    rules_accepted INTEGER DEFAULT 0,
    partner_id TEXT,
    bio TEXT,
    marriage_time INTEGER,
    parent_id TEXT,
    children TEXT
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    item_id TEXT,
    count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS giveaways (
    message_id TEXT PRIMARY KEY,
    guild_id TEXT,
    channel_id TEXT,
    prize TEXT,
    winners INTEGER,
    end_time INTEGER,
    ended INTEGER DEFAULT 0
  );
  
  CREATE TABLE IF NOT EXISTS warns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT,
    user_id TEXT,
    reason TEXT,
    timestamp INTEGER
  );

  CREATE TABLE IF NOT EXISTS logs (
    guild_id TEXT,
    event TEXT,
    channel_id TEXT,
    PRIMARY KEY (guild_id, event)
  );

  CREATE TABLE IF NOT EXISTS fake_permissions (
    guild_id TEXT,
    role_id TEXT,
    permission TEXT,
    PRIMARY KEY (guild_id, role_id, permission)
  );

  CREATE TABLE IF NOT EXISTS invokes (
    guild_id TEXT,
    command TEXT,
    message TEXT,
    PRIMARY KEY (guild_id, command)
  );

  CREATE TABLE IF NOT EXISTS aliases (
    guild_id TEXT,
    alias TEXT,
    command TEXT,
    PRIMARY KEY (guild_id, alias)
  );

  CREATE TABLE IF NOT EXISTS automod (
    guild_id TEXT PRIMARY KEY,
    links INTEGER DEFAULT 0,
    invites INTEGER DEFAULT 0,
    mass_mentions INTEGER DEFAULT 0,
    bad_words INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS reaction_roles (
    message_id TEXT,
    guild_id TEXT,
    channel_id TEXT,
    emoji TEXT,
    role_id TEXT,
    PRIMARY KEY (message_id, emoji)
  );
`);

// Migrations
try { db.prepare('ALTER TABLE guild_configs ADD COLUMN welcome_message TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE guild_configs ADD COLUMN level_channel TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE tickets ADD COLUMN anonymous INTEGER DEFAULT 0').run(); } catch (e) { }
try { db.prepare('ALTER TABLE economy ADD COLUMN rules_accepted INTEGER DEFAULT 0').run(); } catch (e) { }
try { db.prepare('ALTER TABLE economy ADD COLUMN partner_id TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE economy ADD COLUMN bio TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE economy ADD COLUMN marriage_time INTEGER').run(); } catch (e) { }
try { db.prepare('ALTER TABLE economy ADD COLUMN parent_id TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE economy ADD COLUMN children TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE guild_configs ADD COLUMN staff_role TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE guild_configs ADD COLUMN antinuke_enabled INTEGER DEFAULT 0').run(); } catch (e) { }
try { db.prepare('ALTER TABLE guild_configs ADD COLUMN antiraid_enabled INTEGER DEFAULT 0').run(); } catch (e) { }
try { db.prepare('ALTER TABLE guild_configs ADD COLUMN goodbye_channel TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE guild_configs ADD COLUMN goodbye_message TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE guild_configs ADD COLUMN boost_channel TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE guild_configs ADD COLUMN boost_message TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE guild_configs ADD COLUMN voicemaster_channel TEXT').run(); } catch (e) { }
try { db.prepare('ALTER TABLE guild_configs ADD COLUMN voicemaster_category TEXT').run(); } catch (e) { }

export default db;

// Helper functions
export const getGuildConfig = (guildId) => {
  const stmt = db.prepare('SELECT * FROM guild_configs WHERE guild_id = ?');
  return stmt.get(guildId) || { guild_id: guildId, prefix: ',' };
};

export const setGuildConfig = (guildId, key, value) => {
  // Ensure guild exists first
  db.prepare('INSERT OR IGNORE INTO guild_configs (guild_id) VALUES (?)').run(guildId);
  const stmt = db.prepare(`UPDATE guild_configs SET ${key} = ? WHERE guild_id = ?`);
  return stmt.run(value, guildId);
};

export const getUser = (userId, guildId) => {
  const stmt = db.prepare('SELECT * FROM users WHERE user_id = ? AND guild_id = ?');
  return stmt.get(userId, guildId) || { user_id: userId, guild_id: guildId, balance: 0, bank: 0, xp: 0, level: 0 };
};

export const updateUser = (userId, guildId, updates) => {
  db.prepare('INSERT OR IGNORE INTO users (user_id, guild_id) VALUES (?, ?)').run(userId, guildId);

  const keys = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = keys.map(k => `${k} = ?`).join(', ');

  const stmt = db.prepare(`UPDATE users SET ${setClause} WHERE user_id = ? AND guild_id = ?`);
  return stmt.run(...values, userId, guildId);
};

export const getEconomy = (userId) => {
  const stmt = db.prepare('SELECT * FROM economy WHERE user_id = ?');
  return stmt.get(userId) || {
    user_id: userId,
    balance: 0,
    bank: 0,
    last_daily: 0,
    last_work: 0,
    last_rob: 0,
    rules_accepted: 0,
    partner_id: null,
    bio: null,
    marriage_time: null,
    parent_id: null,
    children: '[]'
  };
};

export const updateEconomy = (userId, updates) => {
  db.prepare('INSERT OR IGNORE INTO economy (user_id) VALUES (?)').run(userId);

  const keys = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = keys.map(k => `${k} = ?`).join(', ');

  const stmt = db.prepare(`UPDATE economy SET ${setClause} WHERE user_id = ?`);
  return stmt.run(...values, userId);
};

export const addItem = (userId, itemId, count = 1) => {
  const existing = db.prepare('SELECT * FROM inventory WHERE user_id = ? AND item_id = ?').get(userId, itemId);
  if (existing) {
    db.prepare('UPDATE inventory SET count = count + ? WHERE user_id = ? AND item_id = ?').run(count, userId, itemId);
  } else {
    db.prepare('INSERT INTO inventory (user_id, item_id, count) VALUES (?, ?, ?)').run(userId, itemId, count);
  }
};

export const removeItem = (userId, itemId, count = 1) => {
  const existing = db.prepare('SELECT * FROM inventory WHERE user_id = ? AND item_id = ?').get(userId, itemId);
  if (existing && existing.count >= count) {
    db.prepare('UPDATE inventory SET count = count - ? WHERE user_id = ? AND item_id = ?').run(count, userId, itemId);
    // Remove if 0? Optional.
    db.prepare('DELETE FROM inventory WHERE user_id = ? AND item_id = ? AND count <= 0').run(userId, itemId);
    return true;
  }
  return false;
};
export const addWarning = (guildId, userId, reason) => {
  const stmt = db.prepare('INSERT INTO warns (guild_id, user_id, reason, timestamp) VALUES (?, ?, ?, ?)');
  return stmt.run(guildId, userId, reason, Date.now());
};

export const getWarnings = (guildId, userId) => {
  const stmt = db.prepare('SELECT * FROM warns WHERE guild_id = ? AND user_id = ? ORDER BY timestamp DESC');
  return stmt.all(guildId, userId);
};

export const clearWarnings = (guildId, userId) => {
  const stmt = db.prepare('DELETE FROM warns WHERE guild_id = ? AND user_id = ?');
  return stmt.run(guildId, userId);
};

export const removeWarning = (warningId) => {
  const stmt = db.prepare('DELETE FROM warns WHERE id = ?');
  return stmt.run(warningId);
};

// Logs
export const setLogChannel = (guildId, event, channelId) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO logs (guild_id, event, channel_id) VALUES (?, ?, ?)');
  return stmt.run(guildId, event, channelId);
};

export const getLogChannel = (guildId, event) => {
  const stmt = db.prepare('SELECT channel_id FROM logs WHERE guild_id = ? AND event = ?');
  return stmt.get(guildId, event);
};

// Fake Permissions
export const addFakePermission = (guildId, roleId, permission) => {
  const stmt = db.prepare('INSERT OR IGNORE INTO fake_permissions (guild_id, role_id, permission) VALUES (?, ?, ?)');
  return stmt.run(guildId, roleId, permission);
};

export const removeFakePermission = (guildId, roleId, permission) => {
  const stmt = db.prepare('DELETE FROM fake_permissions WHERE guild_id = ? AND role_id = ? AND permission = ?');
  return stmt.run(guildId, roleId, permission);
};

export const getFakePermissions = (guildId, roleId) => {
  const stmt = db.prepare('SELECT permission FROM fake_permissions WHERE guild_id = ? AND role_id = ?');
  return stmt.all(guildId, roleId).map(r => r.permission);
};

// Invokes
export const setInvokeMessage = (guildId, command, message) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO invokes (guild_id, command, message) VALUES (?, ?, ?)');
  return stmt.run(guildId, command, message);
};

// Aliases
export const addAlias = (guildId, alias, command) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO aliases (guild_id, alias, command) VALUES (?, ?, ?)');
  return stmt.run(guildId, alias, command);
};

export const removeAlias = (guildId, alias) => {
  const stmt = db.prepare('DELETE FROM aliases WHERE guild_id = ? AND alias = ?');
  return stmt.run(guildId, alias);
};

export const getAlias = (guildId, alias) => {
  const stmt = db.prepare('SELECT command FROM aliases WHERE guild_id = ? AND alias = ?');
  return stmt.get(guildId, alias);
};

// Automod
export const setAutomod = (guildId, module, enabled) => {
  db.prepare('INSERT OR IGNORE INTO automod (guild_id) VALUES (?)').run(guildId);
  const stmt = db.prepare(`UPDATE automod SET ${module} = ? WHERE guild_id = ?`);
  return stmt.run(enabled ? 1 : 0, guildId);
};

export const getAutomod = (guildId) => {
  const stmt = db.prepare('SELECT * FROM automod WHERE guild_id = ?');
  return stmt.get(guildId) || { guild_id: guildId, links: 0, invites: 0, mass_mentions: 0, bad_words: 0 };
};

// Reaction Roles
export const addReactionRole = (guildId, channelId, messageId, emoji, roleId) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO reaction_roles (guild_id, channel_id, message_id, emoji, role_id) VALUES (?, ?, ?, ?, ?)');
  return stmt.run(guildId, channelId, messageId, emoji, roleId);
};

export const removeReactionRole = (messageId, emoji) => {
  const stmt = db.prepare('DELETE FROM reaction_roles WHERE message_id = ? AND emoji = ?');
  return stmt.run(messageId, emoji);
};

export const getReactionRole = (messageId, emoji) => {
  const stmt = db.prepare('SELECT role_id FROM reaction_roles WHERE message_id = ? AND emoji = ?');
  return stmt.get(messageId, emoji);
};
