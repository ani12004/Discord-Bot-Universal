import { EmbedBuilder } from "discord.js";
import { getRandomGif } from "../../utils/actionGifs.js";

export default {
    name: "poke",
    description: "Poke someone!",
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) return message.reply("You need to mention someone to poke!");

        const gif = getRandomGif("poke");
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`**${message.author.username}** poked **${target.username}**! 👉`)
            .setImage(gif);

        message.channel.send({ embeds: [embed] });
    },
};
