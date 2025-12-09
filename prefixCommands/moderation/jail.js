import { PermissionsBitField, EmbedBuilder } from "discord.js";

export default {
    name: "jail",
    description: "Jails a user.",
    permissions: [PermissionsBitField.Flags.ManageRoles],
    botPermissions: [PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ManageChannels],
    aliases: ["imprison"],
    async execute(message, args) {
        const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
        const reason = args.slice(1).join(" ") || "No reason provided";

        if (!target) return message.reply("❌ Please mention a user or provide a valid ID.");

        let jailRole = message.guild.roles.cache.find(r => r.name === "Jailed");
        if (!jailRole) {
            try {
                jailRole = await message.guild.roles.create({
                    name: "Jailed",
                    color: "#000000",
                    reason: "Jail role needed for jail command"
                });

                // Overwrite permissions for all channels
                message.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.create(jailRole, {
                        ViewChannel: false,
                        SendMessages: false
                    });
                });
            } catch (e) {
                return message.reply("❌ Failed to create Jail role. Please check my permissions.");
            }
        }

        if (target.roles.cache.has(jailRole.id)) return message.reply("❌ User is already jailed.");

        await target.roles.add(jailRole);

        const embed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle("🔒 User Jailed")
            .setDescription(`**${target.user.tag}** has been jailed.`)
            .addFields({ name: "Reason", value: reason })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
