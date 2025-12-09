import { EmbedBuilder } from "discord.js";
import { getEconomy, updateEconomy } from "../../utils/database.js";

export default {
    name: "marriage",
    description: "Marry another user.",
    permissions: [],
    aliases: ["marry", "divorce"],
    async execute(message, args) {
        const action = message.content.split(" ")[0].slice(2).toLowerCase(); // Assuming prefix length 2 for now, logic needs improvement for dynamic prefix
        // Better logic: check alias used
        const aliasUsed = message.content.split(" ")[0].replace(/[^a-zA-Z]/g, "");

        if (aliasUsed === "divorce") {
            const userEco = getEconomy(message.author.id);
            if (!userEco.partner_id) return message.reply("❌ You are not married!");

            const partnerId = userEco.partner_id;
            updateEconomy(message.author.id, { partner_id: null, marriage_time: null });
            updateEconomy(partnerId, { partner_id: null, marriage_time: null });

            return message.reply(`💔 You have divorced <@${partnerId}>.`);
        }

        const target = message.mentions.members.first();
        if (!target) return message.reply("❌ Mention someone to marry.");
        if (target.id === message.author.id) return message.reply("❌ You cannot marry yourself.");

        const userEco = getEconomy(message.author.id);
        const targetEco = getEconomy(target.id);

        if (userEco.partner_id) return message.reply("❌ You are already married!");
        if (targetEco.partner_id) return message.reply("❌ They are already married!");

        message.channel.send(`${target}, **${message.author.username}** is proposing to you! Type \`yes\` to accept.`);

        const filter = m => m.author.id === target.id && m.content.toLowerCase() === "yes";
        const collector = message.channel.createMessageCollector({ filter, time: 30000, max: 1 });

        collector.on('collect', async m => {
            updateEconomy(message.author.id, { partner_id: target.id, marriage_time: Date.now() });
            updateEconomy(target.id, { partner_id: message.author.id, marriage_time: Date.now() });
            message.channel.send(`💍 **${message.author.username}** and **${target.user.username}** are now married!`);
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') message.channel.send("❌ Proposal expired.");
        });
    },
};
