import { EmbedBuilder } from "discord.js";
import { getInventory } from "../../utils/database.js";
import { getAnimal } from "../../utils/animals.js";
import { checkRules } from "../../utils/checkRules.js";

export default {
    name: "zoo",
    description: "Check your animal inventory.",
    aliases: ["inv", "animals"],
    async execute(message, args) {
        if (!await checkRules(message, message.author.id)) return;

        const inventory = getInventory(message.author.id);

        if (!inventory || inventory.length === 0) {
            return message.reply("You don't have any animals yet! Try `s?hunt`.");
        }

        const description = inventory.map(item => {
            const animal = getAnimal(item.item_id);
            if (!animal) return null;
            return `${animal.emoji} **${animal.name}** x${item.count} (Value: $${animal.price})`;
        }).filter(Boolean).join("\n");

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`${message.author.username}'s Zoo 🦁`)
            .setDescription(description || "Empty");

        message.channel.send({ embeds: [embed] });
    },
};
