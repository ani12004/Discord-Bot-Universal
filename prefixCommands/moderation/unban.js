import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

export default {
    name: "unban",
    description: "Unbans a user from the server.",
    usage: "<userID>",
    permissions: [PermissionFlagsBits.BanMembers],
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply("You do not have permission to use this command.");
        }

        const userId = args[0];
        if (!userId) {
            return message.reply("Please provide the ID of the user you want to unban.");
        }

        try {
            const banList = await message.guild.bans.fetch();
            const bannedUser = banList.get(userId);

            if (!bannedUser) {
                return message.reply("That user is not banned.");
            }

            await message.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("User Unbanned")
                .setDescription(`Successfully unbanned <@${userId}> (${userId}).`)
                .setFooter({ text: `Unbanned by ${message.author.tag}` })
                .setTimestamp();

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply("An error occurred while trying to unban the user. Please check the ID and try again.");
        }
    },
};
