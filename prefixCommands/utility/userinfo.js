import { EmbedBuilder } from "discord.js";
import moment from "moment";

export default {
    name: "userinfo",
    description: "Displays information about a user.",
    aliases: ["whois", "ui"],
    async execute(message, args) {
        const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null) || message.member;
        const user = target.user;

        const embed = new EmbedBuilder()
            .setColor(target.displayHexColor)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .addFields(
                { name: "🆔 ID", value: user.id, inline: true },
                { name: "📅 Joined Server", value: moment(target.joinedAt).format("LLLL"), inline: true },
                { name: "📅 Account Created", value: moment(user.createdAt).format("LLLL"), inline: true },
                { name: "🎭 Roles", value: target.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "None" }
            )
            .setFooter({ text: `Requested by ${message.author.tag}` })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
