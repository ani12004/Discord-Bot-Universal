import { EmbedBuilder } from "discord.js";
import { getUser } from "../../utils/database.js";

export default {
    name: "rank",
    description: "Check your rank and level.",
    aliases: ["level", "xp"],
    async execute(message, args) {
        const target = message.mentions.users.first() || message.author;
        const user = getUser(target.id, message.guild.id);

        const nextLevelXp = (user.level + 1) * 100;

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`${target.username}'s Rank`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "📊 Level", value: `${user.level}`, inline: true },
                { name: "✨ XP", value: `${user.xp} / ${nextLevelXp}`, inline: true }
            );

        message.channel.send({ embeds: [embed] });
    },
};
