import { PermissionsBitField } from "discord.js";
import { setLogChannel } from "../../utils/database.js";

export default {
    name: "log",
    description: "Configure logging channels.",
    permissions: [PermissionsBitField.Flags.ManageGuild],
    aliases: ["logging"],
    async execute(message, args) {
        const action = args[0];

        if (action === "add") {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            const event = args[2];

            if (!channel || !event) return message.reply("❌ Usage: ,log add #channel [event]");

            setLogChannel(message.guild.id, event, channel.id);
            return message.reply(`✅ Logging for **${event}** set to ${channel}.`);
        } else if (action === "remove") {
            // Implement remove logic if needed
            return message.reply("❌ Usage: ,log add #channel [event]");
        } else {
            return message.reply("❌ Usage: ,log add #channel [event]");
        }
    },
};
