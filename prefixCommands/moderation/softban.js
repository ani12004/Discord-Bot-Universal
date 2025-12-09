import { PermissionsBitField, EmbedBuilder } from "discord.js";

export default {
    name: "softban",
    description: "Bans and immediately unbans a user to clear messages.",
    permissions: [PermissionsBitField.Flags.BanMembers],
    botPermissions: [PermissionsBitField.Flags.BanMembers],
    aliases: [],
    async execute(message, args) {
        const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
        const reason = args.slice(1).join(" ") || "No reason provided";

        if (!target) return message.reply("❌ Please mention a user.");
        if (!target.bannable) return message.reply("❌ I cannot ban this user.");

        await target.ban({ reason: `Softban: ${reason}`, deleteMessageSeconds: 604800 }); // Delete 7 days of messages
        await message.guild.members.unban(target.id, "Softban completed");

        const embed = new EmbedBuilder()
            .setColor("#FFA500")
            .setTitle("🧹 User Soft-Banned")
            .setDescription(`**${target.user.tag}** was soft-banned (messages cleared).`)
            .addFields({ name: "Reason", value: reason })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
