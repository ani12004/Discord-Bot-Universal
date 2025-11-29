import { EmbedBuilder, OAuth2Scopes, PermissionFlagsBits } from "discord.js";

export default {
    name: "invite",
    description: "Get the bot's invite link.",
    aliases: ["inv"],
    async execute(message, args, client) {
        const inviteLink = client.generateInvite({
            scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
            permissions: [
                PermissionFlagsBits.Administrator, // Requesting admin for simplicity, or specify needed perms
            ],
        });

        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle("Invite Me!")
            .setDescription(`[Click here to invite me to your server!](${inviteLink})`)
            .setFooter({ text: "Thanks for using the bot!" });

        message.reply({ embeds: [embed] });
    },
};
