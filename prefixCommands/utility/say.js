import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

export default {
  name: "say",
  description: "Send a message or create an embed.",
  async execute(message, args) {
    const embed = new EmbedBuilder()
      .setColor("#FFB6C1")
      .setTitle("Create an Embed")
      .setDescription("Click the button below to create a custom aesthetic embed!");

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('create_embed_button')
          .setLabel('Create Embed')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('✨')
      );

    message.channel.send({ embeds: [embed], components: [row] });
  },
};
