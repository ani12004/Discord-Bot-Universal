import { PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder } from "discord.js";

export default {
    name: "setup",
    description: "Interactive server setup.",
    permissions: [PermissionsBitField.Flags.Administrator],
    async execute(message, args) {
        const select = new StringSelectMenuBuilder()
            .setCustomId("setup_menu")
            .setPlaceholder("Select a server template")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Gaming Server")
                    .setDescription("Setup channels for a gaming community")
                    .setEmoji("🎮")
                    .setValue("gaming"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Community Server")
                    .setDescription("Setup channels for a general community")
                    .setEmoji("🏙️")
                    .setValue("community"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Private Server")
                    .setDescription("Setup locked channels for a private group")
                    .setEmoji("🔒")
                    .setValue("private")
            );

        const row = new ActionRowBuilder().addComponents(select);

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("🛠️ Server Setup")
            .setDescription("Choose a template below to automatically configure channels and roles.\n**Warning:** This will create new channels.");

        message.channel.send({ embeds: [embed], components: [row] });
    },
};
