import { PermissionsBitField, EmbedBuilder } from "discord.js";

export default {
    name: "hardban",
    description: "Bans a user and deletes all messages.",
    permissions: [PermissionsBitField.Flags.BanMembers],
    botPermissions: [PermissionsBitField.Flags.BanMembers],
    aliases: [],
    async execute(message, args) {
        const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
        const reason = args.slice(1).join(" ") || "No reason provided";

        if (!target) return message.reply("❌ Please mention a user.");
        if (!target.bannable) return message.reply("❌ I cannot ban this user.");

        // Delete messages from last 7 days
        await target.ban({ reason: `Hardban: ${reason}`, deleteMessageSeconds: 604800 });

        const embed = new EmbedBuilder()
            .setColor("#8B0000")
            .setTitle("⛔ User Hard-Banned")
            .setDescription(`**${target.user.tag}** has been hard-banned.`)
            .addFields({ name: "Reason", value: reason })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
