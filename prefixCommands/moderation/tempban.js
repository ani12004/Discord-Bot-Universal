import { PermissionsBitField, EmbedBuilder } from "discord.js";
import ms from "ms"; // Assuming ms package is available or I should use a utility

// Simple ms parser if not available
function parseTime(str) {
    if (!str) return null;
    const match = str.match(/^(\d+)([smhd])$/);
    if (!match) return null;
    const val = parseInt(match[1]);
    const unit = match[2];
    if (unit === 's') return val * 1000;
    if (unit === 'm') return val * 60000;
    if (unit === 'h') return val * 3600000;
    if (unit === 'd') return val * 86400000;
    return null;
}

export default {
    name: "tempban",
    description: "Temporarily bans a user.",
    permissions: [PermissionsBitField.Flags.BanMembers],
    botPermissions: [PermissionsBitField.Flags.BanMembers],
    aliases: ["tban"],
    async execute(message, args) {
        const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
        const duration = args[1];
        const reason = args.slice(2).join(" ") || "No reason provided";

        if (!target) return message.reply("❌ Usage: ,tempban @user [duration] [reason]");
        if (!duration) return message.reply("❌ Please provide a duration (e.g., 1d, 1h).");

        const msDuration = parseTime(duration);
        if (!msDuration) return message.reply("❌ Invalid duration format.");

        if (!target.bannable) return message.reply("❌ I cannot ban this user.");

        await target.ban({ reason: `Tempban: ${reason}` });

        const embed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("⏳ User Temp-Banned")
            .setDescription(`**${target.user.tag}** has been banned for **${duration}**.`)
            .addFields({ name: "Reason", value: reason })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

        setTimeout(async () => {
            await message.guild.members.unban(target.id, "Tempban expired").catch(() => { });
        }, msDuration);
    },
};
