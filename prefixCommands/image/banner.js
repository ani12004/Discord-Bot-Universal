import { EmbedBuilder } from "discord.js";

export default {
    name: "banner",
    description: "Displays a user's banner.",
    async execute(message, args, client) {
        const target = message.mentions.users.first() || (args[0] ? await client.users.fetch(args[0]).catch(() => null) : null) || message.author;

        // Need to force fetch to get banner
        const user = await client.users.fetch(target.id, { force: true });

        if (!user.banner) {
            return message.reply("❌ This user does not have a banner.");
        }

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`${user.username}'s Banner`)
            .setImage(user.bannerURL({ dynamic: true, size: 1024 }))
            .setFooter({ text: `Requested by ${message.author.tag}` });

        message.channel.send({ embeds: [embed] });
    },
};
