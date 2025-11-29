import { PermissionsBitField, EmbedBuilder } from "discord.js";


function parseDuration(str) {
    if (!str) return null;
    const match = str.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return null;
    const val = parseInt(match[1]);
    const unit = match[2];
    if (unit === 's') return val * 1000;
    if (unit === 'm') return val * 60 * 1000;
    if (unit === 'h') return val * 60 * 60 * 1000;
    if (unit === 'd') return val * 24 * 60 * 60 * 1000;
    return null;
}

export default {
    name: "gstart",
    description: "Starts a giveaway.",
    permissions: [PermissionsBitField.Flags.ManageEvents], // Using ManageEvents as proxy for giveaway perms
    aliases: ["giveaway"],
    async execute(message, args) {
        const durationStr = args[0];
        const winnersCount = parseInt(args[1]);
        const prize = args.slice(2).join(" ");

        if (!durationStr || !winnersCount || !prize) {
            return message.reply("❌ Usage: `s?gstart <duration> <winners> <prize>`\nExample: `s?gstart 10m 1 Nitro`");
        }

        const duration = parseDuration(durationStr);
        if (!duration) return message.reply("❌ Invalid duration.");

        const endTime = Date.now() + duration;

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("🎉 GIVEAWAY 🎉")
            .setDescription(`**Prize:** ${prize}\n**Winners:** ${winnersCount}\n**Ends:** <t:${Math.floor(endTime / 1000)}:R>`)
            .setFooter({ text: `Hosted by ${message.author.tag}` })
            .setTimestamp(endTime);

        const msg = await message.channel.send({ embeds: [embed] });
        await msg.react("🎉");

        // In a real bot, we'd save this to DB and have a loop checking for ended giveaways.
        // For this template, I'll use a simple timeout for short giveaways, but warn about restarts.
        // Ideally, we should save to DB.

        setTimeout(async () => {
            // End giveaway logic
            const fetchedMsg = await message.channel.messages.fetch(msg.id).catch(() => null);
            if (!fetchedMsg) return;

            const reactions = fetchedMsg.reactions.cache.get("🎉");
            const users = await reactions.users.fetch();
            const validUsers = users.filter(u => !u.bot);

            if (validUsers.size === 0) {
                return message.channel.send("No one entered the giveaway.");
            }

            const winners = validUsers.random(winnersCount);
            const winnerMentions = winners.map(w => w.toString()).join(", ");

            const endEmbed = EmbedBuilder.from(fetchedMsg.embeds[0])
                .setColor("Grey")
                .setDescription(`**Prize:** ${prize}\n**Winners:** ${winnerMentions}\n**Ended:** <t:${Math.floor(Date.now() / 1000)}:R>`);

            fetchedMsg.edit({ embeds: [endEmbed] });
            message.channel.send(`🎉 Congratulations ${winnerMentions}! You won **${prize}**!`);
        }, duration);
    },
};
