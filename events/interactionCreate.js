import { Events } from 'discord.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    // Handle Buttons
    if (interaction.isButton()) {
      // Ticket logic will go here
      // Giveaway logic will go here
      return;
    }

    // Handle Select Menus
    if (interaction.isStringSelectMenu()) {
      // Server Setup logic will go here
      if (interaction.customId === 'setup_menu') {
        // We'll implement this in the setup command file or here
        // For cleaner code, we might emit a custom event or handle it here
        await interaction.reply({ content: `Selected: ${interaction.values[0]} (Feature coming soon)`, ephemeral: true });
      }
      return;
    }
  },
};
