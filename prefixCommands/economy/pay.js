import { EmbedBuilder } from "discord.js";
import { getUser, updateUser } from "../../utils/database.js";

export default {
    name: "pay",
    description: "Pay money to another user.",
    aliases: ["transfer"],
    async execute(message, args) {
        const target = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!target) return message.reply("❌ Please mention a user to pay.");
        if (target.id === message.author.id) return message.reply("❌ You cannot pay yourself.");
        if (isNaN(amount) || amount <= 0) return message.reply("❌ Please provide a valid amount.");

        const sender = getUser(message.author.id, message.guild.id);
        const receiver = getUser(target.id, message.guild.id);

        if (sender.balance < amount) return message.reply("❌ You don't have enough money.");

        updateUser(message.author.id, message.guild.id, { balance: sender.balance - amount });
        updateUser(target.id, message.guild.id, { balance: receiver.balance + amount });

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`💸 You paid **$${amount}** to **${target.username}**.`);

        message.channel.send({ embeds: [embed] });
    },
};
