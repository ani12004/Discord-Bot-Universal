import { EmbedBuilder } from "discord.js";
import db from "../../utils/database.js";

export default {
    name: "leaderboard",
    description: "Shows the richest users.",
    aliases: ["lb", "top"],
    async execute(message, args) {
        const stmt = db.prepare("SELECT user_id, balance FROM users WHERE guild_id = ? ORDER BY balance DESC LIMIT 10");
        const topUsers = stmt.all(message.guild.id);

        if (!topUsers.length) return message.reply("No data found.");

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle(`🏆 ${message.guild.name} Leaderboard`)
            .setTimestamp();

        let description = "";
        for (const [index, data] of topUsers.entries()) {
            // Fetch user to get tag, might be slow if many, but for 10 it's ok-ish or just use ID
            // Ideally we cache or just show ID if not in cache, but let's try to get username
            const user = await message.guild.members.fetch(data.user_id).catch(() => null);
            const name = user ? user.user.username : "Unknown User";
            description += `**${index + 1}.** ${name} - **$${data.balance}**\n`;
        }

        embed.setDescription(description);
        message.channel.send({ embeds: [embed] });
    },
};
