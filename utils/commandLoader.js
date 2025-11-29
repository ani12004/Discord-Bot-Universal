import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadCommands(client) {
  const commandsPath = join(__dirname, '../commands');

  async function loadFromDirectory(directory) {
    const items = readdirSync(directory, { withFileTypes: true });

    for (const item of items) {
      const itemPath = join(directory, item.name);

      if (item.isDirectory()) {
        await loadFromDirectory(itemPath);
      } else if (item.name.endsWith('.js')) {
        try {
          const fileUrl = pathToFileURL(itemPath).href;
          const command = await import(fileUrl);

          if ('data' in command.default && 'execute' in command.default) {
            client.commands.set(command.default.data.name, command.default);
            logger.success(`Loaded command: ${command.default.data.name}`);
          } else {
            logger.warn(`Command at ${itemPath} is missing required "data" or "execute" property.`);
          }
        } catch (error) {
          logger.error(`Error loading command at ${itemPath}: ${error.message}`);
        }
      }
    }
  }

  await loadFromDirectory(commandsPath);
  logger.info(`Loaded ${client.commands.size} commands total.`);
}
