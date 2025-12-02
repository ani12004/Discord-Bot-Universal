import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { getEconomy } from "./database.js";

export async function checkRules(message, userId) {
    const user = getEconomy(userId);

    if (user.rules_accepted === 1) {
        return true;
    }

    const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("⚠️ Rules Acceptance Required")
        .setDescription(
            "**You must accept the bot rules to use economy commands!**\n\n" +
            "• No using macros or scripts.\n" +
            "• No using multiple accounts (alts) to farm money.\n" +
            "• No exploiting bugs (report them instead).\n" +
            "• No trading bot currency for real money.\n\n" +
            "**Failure to follow these rules will result in a ban and account reset.**"
        )
        .setFooter({ text: "Click the button below to accept." });

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('accept_rules_btn')
                .setLabel('I Accept the Rules')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅')
        );

    await message.reply({ embeds: [embed], components: [row] });
    return false;
}
