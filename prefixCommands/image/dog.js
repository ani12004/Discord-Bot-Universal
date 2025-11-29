import { EmbedBuilder } from "discord.js";
import fetch from "node-fetch";

export default {
    name: "dog",
    description: "Get a random dog image.",
    aliases: ["woof"],
    async execute(message, args) {
        try {
            const res = await fetch("https://dog.ceo/api/breeds/image/random");
            const data = await res.json();

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("🐶 Woof!")
                .setImage(data.message);

            message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            message.reply("❌ Failed to fetch dog.");
        }
    },
};
