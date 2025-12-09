import { PermissionsBitField } from "discord.js";
import { addAlias, removeAlias } from "../../utils/database.js";

export default {
    name: "alias",
    description: "Manage custom command aliases.",
    permissions: [PermissionsBitField.Flags.Administrator],
    aliases: [],
    async execute(message, args) {
        const action = args[0];
        const alias = args[1];
        const command = args[2];

        if (action === "add") {
            if (!alias || !command) return message.reply("❌ Usage: ,alias add [alias] [command]");
            addAlias(message.guild.id, alias, command);
            return message.reply(`✅ Alias \`${alias}\` added for command \`${command}\`.`);
        } else if (action === "remove") {
            if (!alias) return message.reply("❌ Usage: ,alias remove [alias]");
            removeAlias(message.guild.id, alias);
            return message.reply(`✅ Alias \`${alias}\` removed.`);
        } else {
            return message.reply("❌ Usage: ,alias add/remove [alias] [command]");
        }
    },
};
