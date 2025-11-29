import { PermissionsBitField, EmbedBuilder } from "discord.js";

export default {
  name: "kick",
  description: "Kicks a user from the server.",
  permissions: [PermissionsBitField.Flags.KickMembers],
  botPermissions: [PermissionsBitField.Flags.KickMembers],
  aliases: [],
  async execute(message, args) {
    const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
    const reason = args.slice(1).join(" ") || "No reason provided";

    if (!target) return message.reply("❌ Please mention a user or provide a valid ID.");
    if (!target.kickable) return message.reply("❌ I cannot kick this user.");

    await target.kick(reason);

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setTitle("🥾 User Kicked")
      .setDescription(`**${target.user.tag}** has been kicked.`)
      .addFields({ name: "Reason", value: reason })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
