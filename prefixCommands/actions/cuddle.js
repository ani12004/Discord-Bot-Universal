import { EmbedBuilder } from "discord.js";
import { getRandomGif } from "../../utils/actionGifs.js";

export default {
    name: "cuddle",
    description: "Cuddle someone!",
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) return message.reply("You need to mention someone to cuddle!");

        const gif = getRandomGif("cuddle");
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`**${message.author.username}** cuddled **${target.username}**! 🫂`)
            .setImage(gif);

        message.channel.send({ embeds: [embed] });
    },
};
