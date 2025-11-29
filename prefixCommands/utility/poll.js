import { EmbedBuilder } from "discord.js";

export default {
    name: "poll",
    description: "Creates a simple yes/no poll.",
    usage: "<question>",
    aliases: ["vote"],
    async execute(message, args, client) {
        if (!args.length) {
            return message.reply("Please provide a question for the poll!");
        }

        const question = args.join(" ");

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("📊 Poll")
            .setDescription(question)
            .setFooter({ text: `Poll started by ${message.author.tag}` })
            .setTimestamp();

        const pollMessage = await message.channel.send({ embeds: [embed] });
        await pollMessage.react("👍");
        await pollMessage.react("👎");
    },
};
