import { EmbedBuilder } from "discord.js";

export default {
    name: "avatar",
    description: "Displays a user's avatar.",
    aliases: ["av", "pfp"],
    async execute(message, args) {
        const target = message.mentions.users.first() || (args[0] ? await client.users.fetch(args[0]).catch(() => null) : null) || message.author;

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`${target.username}'s Avatar`)
            .setImage(target.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setFooter({ text: `Requested by ${message.author.tag}` });

        message.channel.send({ embeds: [embed] });
    },
};
