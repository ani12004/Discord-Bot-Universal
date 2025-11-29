import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { config } from 'dotenv';
import logger from './utils/logger.js';
import { loadEvents } from './utils/eventLoader.js';
import { loadPrefixCommands } from "./handlers/prefixHandler.js";
import db from './utils/database.js'; // Init DB

config(); // Load .env FIRST

// ---------------------------------
// Create the client BEFORE anything
// ---------------------------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

// Collections
client.prefixCommands = new Collection();
client.db = db; // Attach DB to client

// ---------------------------------
// Start the bot
// ---------------------------------
async function startBot() {
  try {
    logger.info('Starting bot...');

    // Load events
    await loadEvents(client);

    // Load prefix commands
    await loadPrefixCommands(client);

    // Login bot
    await client.login(process.env.DISCORD_TOKEN);

  } catch (error) {
    logger.error(`Failed to start bot: ${error.message}`);
    process.exit(1);
  }
}

startBot();
