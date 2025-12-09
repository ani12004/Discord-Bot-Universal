import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();

const commands = [];
const base = "slashCommands";

if (fs.existsSync(base)) {
    const categories = fs.readdirSync(base);

    for (const category of categories) {
        const folderPath = path.join(base, category);
        if (!fs.lstatSync(folderPath).isDirectory()) continue;

        const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));

        for (const file of files) {
            try {
                const commandPath = path.join(process.cwd(), base, category, file);
                // Dynamic import needs file URL on Windows usually, but let's try relative path
                const command = (await import(`file://${commandPath}`)).default;
                if (command?.data) {
                    commands.push(command.data.toJSON());
                    console.log(`Loaded ${command.data.name}`);
                }
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
            }
        }
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // Use applicationCommands for global updates (might take 1 hour to propagate)
        // Or guildCommands for instant updates in a specific guild
        // For now, let's assume global
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
