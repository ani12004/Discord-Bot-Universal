import { EmbedBuilder } from "discord.js";
import { getRandomGif } from "../../utils/actionGifs.js";

export default {
    name: "pat",
    description: "Pat someone!",
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) return message.reply("You need to mention someone to pat!");

        const gif = getRandomGif("pat");
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`**${message.author.username}** patted **${target.username}**! 💆`)
            .setImage(gif);

        message.channel.send({ embeds: [embed] });
    },
};
