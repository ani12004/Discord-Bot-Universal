import { EmbedBuilder } from "discord.js";
import { getRandomGif } from "../../utils/actionGifs.js";

export default {
    name: "dance",
    description: "Dance!",
    async execute(message, args) {
        const gif = getRandomGif("dance");
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`**${message.author.username}** is dancing! 💃`)
            .setImage(gif);

        message.channel.send({ embeds: [embed] });
    },
};
