import { PermissionsBitField } from "discord.js";
import { setGuildConfig } from "../../utils/database.js";

export default {
    name: "bind",
    description: "Bind a role as staff.",
    permissions: [PermissionsBitField.Flags.Administrator],
    aliases: [],
    async execute(message, args) {
        const type = args[0];
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);

        if (type !== "staff" || !role) return message.reply("❌ Usage: ,bind staff @role");

        setGuildConfig(message.guild.id, "staff_role", role.id);
        return message.reply(`✅ **${role.name}** has been bound as the Staff role.`);
    },
};
