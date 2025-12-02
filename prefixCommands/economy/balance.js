import { EmbedBuilder } from "discord.js";
import { getEconomy } from "../../utils/database.js";
import { checkRules } from "../../utils/checkRules.js";

export default {
    name: "balance",
    description: "Check your balance.",
    aliases: ["bal", "money"],
    async execute(message, args) {
        if (!await checkRules(message, message.author.id)) return;

        const target = message.mentions.users.first() || message.author;
        const user = getEconomy(target.id);

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
