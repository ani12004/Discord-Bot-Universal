import { PermissionsBitField } from "discord.js";
import { addReactionRole, removeReactionRole } from "../../utils/database.js";

export default {
    name: "reactionrole",
    description: "Manage reaction roles.",
    permissions: [PermissionsBitField.Flags.Administrator],
    aliases: ["rr"],
    async execute(message, args) {
        const action = args[0];

        if (action === "add") {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            const messageId = args[2];
            const emoji = args[3];
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[4]);

            if (!channel || !messageId || !emoji || !role) return message.reply("❌ Usage: ,rr add #channel [messageId] [emoji] @role");

            try {
                const targetMessage = await channel.messages.fetch(messageId);
                await targetMessage.react(emoji);
                addReactionRole(message.guild.id, channel.id, messageId, emoji, role.id);
                return message.reply(`✅ Reaction role added for ${emoji} -> **${role.name}**.`);
            } catch (e) {
                return message.reply("❌ Failed to fetch message or react. Check ID and permissions.");
            }
        } else if (action === "remove") {
            const messageId = args[1];
            const emoji = args[2];

            if (!messageId || !emoji) return message.reply("❌ Usage: ,rr remove [messageId] [emoji]");

            removeReactionRole(messageId, emoji);
            return message.reply(`✅ Reaction role removed for ${emoji}.`);
        } else {
            return message.reply("❌ Usage: ,rr add/remove ...");
        }
    },
};
