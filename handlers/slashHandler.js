import fs from "fs";
import path from "path";

export async function loadSlashCommands(client) {
    client.slashCommands = new Map();
    client.slashCommandsData = [];

    const base = "slashCommands";
    if (!fs.existsSync(base)) {
        fs.mkdirSync(base);
        return;
    }

    const categories = fs.readdirSync(base);

    for (const category of categories) {
        const folderPath = path.join(base, category);
        if (!fs.lstatSync(folderPath).isDirectory()) continue;

        const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));

        for (const file of files) {
            try {
                const command = (await import(`../${base}/${category}/${file}`)).default;

                if (!command?.data) continue;

                command.category = category;
                client.slashCommands.set(command.data.name, command);
                client.slashCommandsData.push(command.data.toJSON());

                console.log(`[SLASH] Loaded: ${command.data.name}`);
            } catch (error) {
                console.error(`[SLASH] Failed to load command ${file}:`, error);
            }
        }
    }
}
