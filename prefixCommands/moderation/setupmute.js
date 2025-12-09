import { PermissionsBitField } from "discord.js";

export default {
    name: "setupmute",
    description: "Sets up the Muted role.",
    permissions: [PermissionsBitField.Flags.Administrator],
    aliases: [],
    async execute(message, args) {
        let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");

        if (!muteRole) {
            try {
                muteRole = await message.guild.roles.create({
                    name: "Muted",
                    color: "#808080",
                    reason: "Mute role setup"
                });
            } catch (e) {
                return message.reply("❌ Failed to create Muted role.");
            }
        }

        message.channel.send("⏳ Configuring channel permissions...");

        message.guild.channels.cache.forEach(async (channel) => {
            await channel.permissionOverwrites.create(muteRole, {
                SendMessages: false,
                AddReactions: false,
                Speak: false
            });
        });

        return message.reply(`✅ **Muted** role has been set up and applied to all channels.`);
    },
};
