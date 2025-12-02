import { EmbedBuilder } from "discord.js";
import { getRandomGif } from "../../utils/actionGifs.js";

export default {
    name: "slap",
    description: "Slap someone!",
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) return message.reply("You need to mention someone to slap!");

        const gif = getRandomGif("slap");
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`**${message.author.username}** slapped **${target.username}**! 👋`)
            .setImage(gif);

        message.channel.send({ embeds: [embed] });
    },
};
