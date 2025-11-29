import { EmbedBuilder } from "discord.js";
import { getUser, updateUser } from "../../utils/database.js";

export default {
    name: "work",
    description: "Work to earn money.",
    async execute(message, args) {
        const userId = message.author.id;
        const guildId = message.guild.id;
        const user = getUser(userId, guildId);

        const cooldown = 60 * 60 * 1000; // 1 hour
        const now = Date.now();

        if (now - user.last_work < cooldown) {
            const remaining = cooldown - (now - user.last_work);
            const minutes = Math.ceil(remaining / 60000);
            return message.reply(`⏳ You can work again in **${minutes} minutes**.`);
        }

        const earnings = Math.floor(Math.random() * 500) + 100;

        updateUser(userId, guildId, {
            balance: user.balance + earnings,
            last_work: now
        });

        const jobs = ["Programmer", "Builder", "Waiter", "Chef", "Mechanic"];
        const job = jobs[Math.floor(Math.random() * jobs.length)];

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`👷 You worked as a **${job}** and earned **$${earnings}**!`);

        message.channel.send({ embeds: [embed] });
    },
};
