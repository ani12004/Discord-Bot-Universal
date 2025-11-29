import { EmbedBuilder } from "discord.js";

export default {
    name: "dice",
    description: "Roll a die.",
    aliases: ["roll"],
    async execute(message, args) {
        const result = Math.floor(Math.random() * 6) + 1;

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🎲 Dice Roll")
            .setDescription(`You rolled a **${result}**!`);

        message.channel.send({ embeds: [embed] });
    },
};
