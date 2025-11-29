import { EmbedBuilder } from "discord.js";

export default {
    name: "coinflip",
    description: "Flip a coin.",
    aliases: ["cf", "flip"],
    async execute(message, args) {
        const result = Math.random() < 0.5 ? "Heads" : "Tails";

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle("🪙 Coin Flip")
            .setDescription(`The coin landed on **${result}**!`);

        message.channel.send({ embeds: [embed] });
    },
};
