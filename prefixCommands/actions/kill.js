import { EmbedBuilder } from "discord.js";
import { getRandomGif } from "../../utils/actionGifs.js";

export default {
    name: "kill",
    description: "Kill someone (RP)!",
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) return message.reply("You need to mention someone to kill!");

        const gif = getRandomGif("kill");
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`**${message.author.username}** killed **${target.username}**! 💀`)
            .setImage(gif);

        message.channel.send({ embeds: [embed] });
    },
};
