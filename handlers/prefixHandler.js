import fs from "fs";
import path from "path";

export async function loadPrefixCommands(client) {
  client.prefixCommands = new Map();

  const base = "prefixCommands";
  const categories = fs.readdirSync(base);

  for (const category of categories) {
    const folderPath = path.join(base, category);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));

    for (const file of files) {
      try {
        const command = (await import(`../${base}/${category}/${file}`)).default;

        if (!command?.name) continue;

        command.category = category; // Attach category

        client.prefixCommands.set(command.name, command);

        if (command.aliases?.length) {
          for (const alias of command.aliases) {
            client.prefixCommands.set(alias, command);
          }
        }

        console.log(`[PREFIX] Loaded: ${command.name}`);
      } catch (error) {
        console.error(`[PREFIX] Failed to load command ${file}:`, error);
      }
    }
  }
}
