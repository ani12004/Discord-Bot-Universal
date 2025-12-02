import { PermissionsBitField, EmbedBuilder } from "discord.js";

export default {
  name: "purge",
  description: "Deletes messages.",
  permissions: [PermissionsBitField.Flags.ManageMessages],
  botPermissions: [PermissionsBitField.Flags.ManageMessages],
  aliases: ["clear"],
  async execute(message, args) {
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply("❌ Please provide a number between 1 and 100.");
    }

    await message.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      message.reply("❌ Failed to delete messages. They might be older than 14 days.");
    });

    const embed = new EmbedBuilder()
      .setColor("#FFB6C1")
      .setTitle("🧹 Purged")
      .setDescription(`Deleted **${amount}** messages.`);

    const msg = await message.channel.send({ embeds: [embed] });
    setTimeout(() => msg.delete().catch(() => { }), 3000);
  },
};
