import { PermissionsBitField, EmbedBuilder } from "discord.js";
import { setGuildConfig } from "../../utils/database.js";

export default {
    name: "setup",
    description: "Interactive setup for bot configuration.",
    permissions: [PermissionsBitField.Flags.Administrator],
    aliases: [],
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor("#00f3ff")
            .setTitle("🛠️ Server Setup")
            .setDescription("Please reply with the channel mention for **Log Channel** (or type 'skip').")
            .setFooter({ text: "Type 'cancel' to stop." });

        await message.channel.send({ embeds: [embed] });

        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        let step = 0;
        let config = {};

        collector.on('collect', async m => {
            if (m.content.toLowerCase() === 'cancel') {
                collector.stop('cancelled');
                return message.channel.send("❌ Setup cancelled.");
            }

            if (step === 0) {
                // Log Channel
                if (m.content.toLowerCase() !== 'skip') {
                    const channel = m.mentions.channels.first() || m.guild.channels.cache.get(m.content);
                    if (channel) config.log_channel = channel.id;
                }

                step++;
                message.channel.send("Please reply with the channel mention for **Welcome Channel** (or type 'skip').");
            } else if (step === 1) {
                // Welcome Channel
                if (m.content.toLowerCase() !== 'skip') {
                    const channel = m.mentions.channels.first() || m.guild.channels.cache.get(m.content);
                    if (channel) config.welcome_channel = channel.id;
                }

                step++;
                message.channel.send("Please reply with the **Prefix** you want to use (or type 'skip' for default `s?`).");
            } else if (step === 2) {
                // Prefix
                if (m.content.toLowerCase() !== 'skip') {
                    config.prefix = m.content;
                }

                collector.stop('finished');
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'finished') {
                if (config.log_channel) setGuildConfig(message.guild.id, "log_channel", config.log_channel);
                if (config.welcome_channel) setGuildConfig(message.guild.id, "welcome_channel", config.welcome_channel);
                if (config.prefix) setGuildConfig(message.guild.id, "prefix", config.prefix);

                const finishEmbed = new EmbedBuilder()
                    .setColor("#00FF00")
                    .setTitle("✅ Setup Complete")
                    .setDescription("Server configuration has been updated.")
                    .addFields(
                        { name: "Log Channel", value: config.log_channel ? `<#${config.log_channel}>` : "Not Set", inline: true },
                        { name: "Welcome Channel", value: config.welcome_channel ? `<#${config.welcome_channel}>` : "Not Set", inline: true },
                        { name: "Prefix", value: config.prefix || "s?", inline: true }
                    );
                message.channel.send({ embeds: [finishEmbed] });
            }
        });
    },
};
