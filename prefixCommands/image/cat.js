import { EmbedBuilder } from "discord.js";
import fetch from "node-fetch";

export default {
    name: "cat",
    description: "Get a random cat image.",
    aliases: ["meow"],
    async execute(message, args) {
        try {
            const res = await fetch("https://api.thecatapi.com/v1/images/search");
            const data = await res.json();

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("🐱 Meow!")
                .setImage(data[0].url);

            message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            message.reply("❌ Failed to fetch cat.");
        }
    },
};
