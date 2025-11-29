import fetch from "node-fetch";
import { EmbedBuilder } from "discord.js";

export default {
    name: "joke",
    description: "Get a random joke.",
    async execute(message, args, client) {
        try {
            const response = await fetch("https://official-joke-api.appspot.com/random_joke");
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("🤣 Random Joke")
                .addFields(
                    { name: "Setup", value: data.setup },
                    { name: "Punchline", value: `||${data.punchline}||` } // Spoiler for punchline
                )
                .setFooter({ text: "Powered by official-joke-api.appspot.com" });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply("Couldn't fetch a joke right now. Try again later!");
        }
    },
};
