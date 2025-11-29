import { EmbedBuilder } from "discord.js";
import fetch from "node-fetch"; // Need to check if node-fetch is available or use native fetch in Node 18+

export default {
    name: "meme",
    description: "Get a random meme.",
    async execute(message, args) {
        try {
            const res = await fetch("https://meme-api.com/gimme");
            const data = await res.json();

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setTitle(data.title)
                .setURL(data.postLink)
                .setImage(data.url)
                .setFooter({ text: `👍 ${data.ups} | r/${data.subreddit}` });

            message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            message.reply("❌ Failed to fetch meme.");
        }
    },
};
