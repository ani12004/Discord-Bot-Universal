import { EmbedBuilder } from "discord.js";
import { getRandomGif } from "../../utils/actionGifs.js";

export default {
    name: "cry",
    description: "Cry!",
    async execute(message, args) {
        const gif = getRandomGif("cry");
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`**${message.author.username}** is crying... 😢`)
            .setImage(gif);

        message.channel.send({ embeds: [embed] });
    },
};
