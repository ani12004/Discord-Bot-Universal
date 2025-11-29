import { EmbedBuilder } from "discord.js";
import { getUser } from "../../utils/database.js";

export default {
    name: "balance",
    description: "Check your balance.",
    aliases: ["bal", "money"],
    async execute(message, args) {
        const target = message.mentions.users.first() || message.author;
        const user = getUser(target.id, message.guild.id);

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle(`${target.username}'s Balance`)
            .addFields(
                { name: "💵 Wallet", value: `${user.balance}`, inline: true },
                { name: "🏦 Bank", value: `${user.bank}`, inline: true }
            );

        message.channel.send({ embeds: [embed] });
    },
};
