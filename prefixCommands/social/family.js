import { EmbedBuilder } from "discord.js";
import { getEconomy, updateEconomy } from "../../utils/database.js";

export default {
    name: "family",
    description: "Manage your family.",
    permissions: [],
    aliases: ["adopt", "disown"],
    async execute(message, args) {
        const aliasUsed = message.content.split(" ")[0].replace(/[^a-zA-Z]/g, "");

        if (aliasUsed === "disown") {
            const target = message.mentions.members.first();
            if (!target) return message.reply("❌ Mention someone to disown.");

            const userEco = getEconomy(message.author.id);
            let children = JSON.parse(userEco.children || "[]");

            if (!children.includes(target.id)) return message.reply("❌ They are not your child.");

            children = children.filter(id => id !== target.id);
            updateEconomy(message.author.id, { children: JSON.stringify(children) });
            updateEconomy(target.id, { parent_id: null });

            return message.reply(`💔 You have disowned **${target.user.username}**.`);
        }

        if (aliasUsed === "adopt") {
            const target = message.mentions.members.first();
            if (!target) return message.reply("❌ Mention someone to adopt.");
            if (target.id === message.author.id) return message.reply("❌ You cannot adopt yourself.");

            const targetEco = getEconomy(target.id);
            if (targetEco.parent_id) return message.reply("❌ They already have a parent.");

            message.channel.send(`${target}, **${message.author.username}** wants to adopt you! Type \`yes\` to accept.`);

            const filter = m => m.author.id === target.id && m.content.toLowerCase() === "yes";
            const collector = message.channel.createMessageCollector({ filter, time: 30000, max: 1 });

            collector.on('collect', async m => {
                const userEco = getEconomy(message.author.id);
                let children = JSON.parse(userEco.children || "[]");
                children.push(target.id);

                updateEconomy(message.author.id, { children: JSON.stringify(children) });
                updateEconomy(target.id, { parent_id: message.author.id });

                message.channel.send(`👪 **${message.author.username}** has adopted **${target.user.username}**!`);
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') message.channel.send("❌ Adoption offer expired.");
            });
        }
    },
};
