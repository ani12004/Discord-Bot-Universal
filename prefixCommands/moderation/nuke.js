import { PermissionsBitField } from "discord.js";

export default {
    name: "nuke",
    description: "Nukes the channel (clones and deletes).",
    permissions: [PermissionsBitField.Flags.ManageChannels],
    botPermissions: [PermissionsBitField.Flags.ManageChannels],
    async execute(message, args) {
        const channel = message.channel;
        const position = channel.position;

        const confirmation = await message.reply("⚠️ Are you sure you want to NUKE this channel? Type `yes` to confirm.");
        const filter = m => m.author.id === message.author.id && m.content.toLowerCase() === 'yes';

        try {
            await channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] });
        } catch (e) {
            return message.channel.send("❌ Nuke cancelled (timed out).");
        }

        const newChannel = await channel.clone();
        await channel.delete();
        await newChannel.setPosition(position);
        await newChannel.send("💥 Channel Nuked!");
        await newChannel.send("https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif");
    },
};
