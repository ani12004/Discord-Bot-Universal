import { PermissionsBitField } from "discord.js";
import { setGuildConfig } from "../../utils/database.js";

export default {
    name: "boost",
    description: "Configure boost system.",
    permissions: [PermissionsBitField.Flags.Administrator],
    aliases: [],
    async execute(message, args) {
        const action = args[0];

        if (action === "add") {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            const msg = args.slice(2).join(" ");

            if (!channel || !msg) return message.reply("❌ Usage: ,boost add #channel [message]");

            // Similar to goodbye, needs DB columns.
            return message.reply("⚠️ Boost system requires database update. Please contact developer.");
        } else {
            return message.reply("❌ Usage: ,boost add #channel [message]");
        }
    },
};
