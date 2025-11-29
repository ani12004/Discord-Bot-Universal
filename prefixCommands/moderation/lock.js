import { PermissionsBitField, EmbedBuilder } from "discord.js";

export default {
    name: "lock",
    description: "Locks the current channel.",
    permissions: [PermissionsBitField.Flags.ManageChannels],
    botPermissions: [PermissionsBitField.Flags.ManageChannels],
    async execute(message, args) {
        await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            SendMessages: false,
        });

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🔒 Channel Locked")
            .setDescription("This channel has been locked by a moderator.");

        message.channel.send({ embeds: [embed] });
    },
};
