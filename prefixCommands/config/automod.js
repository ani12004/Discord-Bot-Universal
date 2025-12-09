import { PermissionsBitField, EmbedBuilder } from "discord.js";
import { setAutomod, getAutomod } from "../../utils/database.js";

export default {
    name: "automod",
    description: "Configure auto-moderation.",
    permissions: [PermissionsBitField.Flags.Administrator],
    aliases: [],
    async execute(message, args) {
        const module = args[0];
        const action = args[1];

        const validModules = ["links", "invites", "mass_mentions", "bad_words"];

        if (!module || !validModules.includes(module)) {
            const config = getAutomod(message.guild.id);
            const embed = new EmbedBuilder()
                .setColor("#00f3ff")
                .setTitle("🛡️ Automod Configuration")
                .setDescription("Usage: `,automod [module] [on/off]`")
                .addFields(
                    { name: "Links", value: config.links ? "✅ On" : "❌ Off", inline: true },
                    { name: "Invites", value: config.invites ? "✅ On" : "❌ Off", inline: true },
                    { name: "Mass Mentions", value: config.mass_mentions ? "✅ On" : "❌ Off", inline: true },
                    { name: "Bad Words", value: config.bad_words ? "✅ On" : "❌ Off", inline: true }
                );
            return message.channel.send({ embeds: [embed] });
        }

        if (action === "on") {
            setAutomod(message.guild.id, module, true);
            return message.reply(`✅ Automod module **${module}** enabled.`);
        } else if (action === "off") {
            setAutomod(message.guild.id, module, false);
            return message.reply(`✅ Automod module **${module}** disabled.`);
        } else {
            return message.reply("❌ Usage: ,automod [module] [on/off]");
        }
    },
};
