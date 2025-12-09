import { PermissionsBitField } from "discord.js";
import { setInvokeMessage } from "../../utils/database.js";

export default {
    name: "invoke",
    description: "Customize command messages.",
    permissions: [PermissionsBitField.Flags.Administrator],
    aliases: [],
    async execute(message, args) {
        const command = args[0];
        const customMessage = args.slice(1).join(" ");

        if (!command || !customMessage) return message.reply("❌ Usage: ,invoke [command] [message]");

        setInvokeMessage(message.guild.id, command, customMessage);
        return message.reply(`✅ Custom message for **${command}** set.`);
    },
};
