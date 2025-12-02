import { EmbedBuilder } from "discord.js";
import { getRandomGif } from "../../utils/actionGifs.js";

export default {
    name: "kiss",
    description: "Kiss someone!",
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) return message.reply("You need to mention someone to kiss!");

        const gif = getRandomGif("kiss");
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`**${message.author.username}** kissed **${target.username}**! 💋`)
            .setImage(gif);

        message.channel.send({ embeds: [embed] });
    },
};
