import { EmbedBuilder, ChannelType } from "discord.js";
import moment from "moment";

export default {
    name: "serverinfo",
    description: "Displays information about the server.",
    aliases: ["si"],
    async execute(message, args) {
        const guild = message.guild;
        const owner = await guild.fetchOwner();

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
            .setTitle(`${guild.name} Server Info`)
            .addFields(
                { name: "👑 Owner", value: owner.user.tag, inline: true },
                { name: "🆔 ID", value: guild.id, inline: true },
                { name: "📅 Created", value: moment(guild.createdAt).format("LL"), inline: true },
                { name: "👥 Members", value: `${guild.memberCount}`, inline: true },
                { name: "💬 Channels", value: `${guild.channels.cache.size}`, inline: true },
                { name: "🎭 Roles", value: `${guild.roles.cache.size}`, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.tag}` })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
