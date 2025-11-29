// utils/eventLoader.js
import { readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import logger from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Recursively gather all .js files under a folder
 */
function getAllFiles(folder) {
  const entries = readdirSync(folder);
  const files = [];

  for (const entry of entries) {
    const full = join(folder, entry);
    const st = statSync(full);

    if (st.isDirectory()) {
      files.push(...getAllFiles(full));
    } else if (entry.endsWith(".js")) {
      files.push(full);
    }
  }

  return files;
}

/**
 * Load events and bind them to client.
 * Each event file must export default { name: string, execute: function, once?: boolean }
 * execute will be called as: execute(...args, client)
 */
export async function loadEvents(client) {
  try {
    const eventsPath = join(__dirname, "../events");
    const files = getAllFiles(eventsPath);

    for (const filePath of files) {
      const fileUrl = pathToFileURL(filePath).href;

      try {
        const imported = await import(fileUrl);
        const event = imported.default;

        if (!event || !event.name || typeof event.execute !== "function") {
          logger.warn(`Invalid event file (missing name/execute): ${filePath}`);
          continue;
        }

        // wrapper to catch errors in event execution so the client doesn't crash
        const handler = (...args) => {
          (async () => {
            try {
              await event.execute(...args, client);
            } catch (err) {
              logger.error(`Error in event "${event.name}" from ${filePath}: ${err.stack || err}`);
            }
          })().catch(err => {
            // last-resort catch (shouldn't be needed)
            logger.error(`Unhandled error in event wrapper for ${event.name}: ${err.stack || err}`);
          });
        };

        if (event.once) {
          client.once(event.name, handler);
        } else {
          client.on(event.name, handler);
        }

        logger.success(`Loaded event: ${event.name} (${filePath})`);
      } catch (err) {
        logger.error(`Failed to import event file ${filePath}: ${err.message}`);
      }
    }
  } catch (err) {
    logger.error(`Failed loading events: ${err.stack || err}`);
  }
}
