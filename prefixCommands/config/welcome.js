import { PermissionsBitField } from "discord.js";
import { setGuildConfig } from "../../utils/database.js";

export default {
    name: "welcome",
    description: "Configure welcome system.",
    permissions: [PermissionsBitField.Flags.Administrator],
    aliases: [],
    async execute(message, args) {
        const action = args[0];

        if (action === "add") {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            const msg = args.slice(2).join(" ");

            if (!channel || !msg) return message.reply("❌ Usage: ,welcome add #channel [message]");

            setGuildConfig(message.guild.id, "welcome_channel", channel.id);
            setGuildConfig(message.guild.id, "welcome_message", msg);
            return message.reply(`✅ Welcome channel set to ${channel} with message: \`${msg}\``);
        } else if (action === "view") {
            // Implement view logic
            return message.reply("❌ Usage: ,welcome add #channel [message]");
        } else {
            return message.reply("❌ Usage: ,welcome add #channel [message]");
        }
    },
};
