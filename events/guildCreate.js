import { Events } from 'discord.js';
import { setGuildConfig } from '../utils/database.js';

export default {
    name: Events.GuildCreate,
    async execute(guild) {
        console.log(`Joined new guild: ${guild.name} (${guild.id})`);
        // Initialize default config
        setGuildConfig(guild.id, 'prefix', 's?');
    },
};
