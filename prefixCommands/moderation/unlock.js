import { PermissionsBitField, EmbedBuilder } from "discord.js";

export default {
    name: "unlock",
    description: "Unlocks the current channel.",
    permissions: [PermissionsBitField.Flags.ManageChannels],
    botPermissions: [PermissionsBitField.Flags.ManageChannels],
    async execute(message, args) {
        await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            SendMessages: null,
        });

        const embed = new EmbedBuilder()
            .setColor("#FFB6C1")
            .setTitle("🔓 Channel Unlocked")
            .setDescription("This channel has been unlocked.");

        message.channel.send({ embeds: [embed] });
    },
};
