import { EmbedBuilder } from "discord.js";
import { getRandomGif } from "../../utils/actionGifs.js";

export default {
    name: "hug",
    description: "Hug someone!",
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) return message.reply("You need to mention someone to hug!");

        const gif = getRandomGif("hug");
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`**${message.author.username}** hugged **${target.username}**! 🤗`)
            .setImage(gif);

        message.channel.send({ embeds: [embed] });
    },
};
