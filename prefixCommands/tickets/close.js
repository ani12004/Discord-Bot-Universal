import { PermissionsBitField } from "discord.js";

export default {
    name: "close",
    description: "Closes the current ticket.",
    async execute(message, args) {
        if (!message.channel.name.startsWith("ticket-")) {
            return message.reply("❌ This command can only be used in ticket channels.");
        }

        message.reply("🔒 Closing ticket in 5 seconds...");
        setTimeout(() => {
            message.channel.delete().catch(() => { });
        }, 5000);

        // TODO: Save transcript logic here
    },
};
