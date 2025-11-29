import { EmbedBuilder } from "discord.js";

export default {
    name: "rps",
    description: "Play Rock Paper Scissors.",
    async execute(message, args) {
        const choices = ["rock", "paper", "scissors"];
        const userChoice = args[0]?.toLowerCase();

        if (!choices.includes(userChoice)) {
            return message.reply("❌ Please choose `rock`, `paper`, or `scissors`.");
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result;
        if (userChoice === botChoice) {
            result = "It's a tie! 🤝";
        } else if (
            (userChoice === "rock" && botChoice === "scissors") ||
            (userChoice === "paper" && botChoice === "rock") ||
            (userChoice === "scissors" && botChoice === "paper")
        ) {
            result = "You win! 🎉";
        } else {
            result = "I win! 🤖";
        }

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("Rock Paper Scissors")
            .setDescription(`You chose **${userChoice}**\nI chose **${botChoice}**\n\n**${result}**`);

        message.channel.send({ embeds: [embed] });
    },
};
