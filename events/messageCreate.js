import { Events, ChannelType, PermissionsBitField, EmbedBuilder } from 'discord.js';
import db, { getGuildConfig, updateUser, getUser } from '../utils/database.js';
import { checkRules } from '../utils/checkRules.js';

const cooldowns = new Map();
const spamMap = new Map();

export default {
    name: Events.MessageCreate,
    async execute(message, client) {
        try {
            if (message.author.bot) return;

            // --- MODMAIL: DM Handling ---
            if (!message.guild) {
                const userId = message.author.id;

                // Check cache for existing ticket
                let existingTicket = null;
                for (const t of client.activeTickets.values()) {
                    if (t.user_id === userId) {
                        existingTicket = t;
                        break;
                    }
                }

                // 1. Existing Ticket
                if (existingTicket) {
                    const channel = client.channels.cache.get(existingTicket.channel_id);
                    if (channel) {
                        const embed = new EmbedBuilder()
                            .setColor("Blue")
                            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                            .setDescription(message.content || "*Attachment/No Content*")
                            .setTimestamp();

                        if (message.attachments.size > 0) {
                            embed.setImage(message.attachments.first().url);
                        }

                        return channel.send({ embeds: [embed] }).catch(() => message.reply("❌ Could not send message. Ticket channel might be deleted."));
                    }
                }

                // 2. New Ticket
                // Find a guild to open ticket in (Default: First guild the bot is in)
                const guild = client.guilds.cache.first();
                if (!guild) return message.reply("❌ I am not in any servers.");

                const config = getGuildConfig(guild.id);
                const categoryId = config.ticket_category; // Use configured category if available

                const channel = await guild.channels.create({
                    name: `modmail-${message.author.username}`,
                    type: ChannelType.GuildText,
                    parent: categoryId || null,
                    permissionOverwrites: [
                        { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                        { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                    ]
                });

                const ticketId = `${guild.id}-${userId}-${Date.now()}`;

                // Insert into DB
                db.prepare('INSERT INTO tickets (ticket_id, guild_id, user_id, channel_id) VALUES (?, ?, ?, ?)').run(ticketId, guild.id, userId, channel.id);

                // Update Cache
                const newTicket = { ticket_id: ticketId, guild_id: guild.id, user_id: userId, channel_id: channel.id, closed: 0, anonymous: 0 };
                client.activeTickets.set(channel.id, newTicket);

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("New Modmail Ticket")
                    .setDescription(`**User:** ${message.author}\n**ID:** ${message.author.id}\n\n${message.content}`)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setTimestamp();

                channel.send({ content: "@here", embeds: [embed] });
                return message.reply("✅ **Ticket Created!** Support team has been notified.");
            }

            // --- MODMAIL: Reply to User ---
            // Check cache first
            if (client.activeTickets && client.activeTickets.has(message.channel.id)) {
                const ticket = client.activeTickets.get(message.channel.id);
                const config = getGuildConfig(message.guild.id); // This is now cached too
                const prefix = config.prefix || 's?';

                // If it's NOT a command, relay to user
                if (!message.content.startsWith(prefix)) {
                    const userId = ticket.user_id;
                    const user = await client.users.fetch(userId).catch(() => null);

                    if (user) {
                        const embed = new EmbedBuilder()
                            .setColor("Green")
                            .setDescription(message.content || "*Attachment/No Content*")
                            .setTimestamp();

                        if (ticket.anonymous) {
                            embed.setAuthor({ name: "Staff Team", iconURL: message.guild.iconURL() });
                        } else {
                            embed.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });
                        }

                        if (message.attachments.size > 0) {
                            embed.setImage(message.attachments.first().url);
                        }

                        user.send({ embeds: [embed] }).catch(() => message.react('❌'));
                        message.react('✅');
                        return;
                    }
                }
            }

            const userId = message.author.id;
            const guildId = message.guild.id;
            const now = Date.now();

            // --- AUTO MODERATION ---
            // 1. Bad Words Filter
            const badWords = ["badword1", "badword2", "scam"]; // Example list
            if (badWords.some(word => message.content.toLowerCase().includes(word))) {
                // Check if user has admin/mod perms to bypass
                if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                    await message.delete().catch(() => { });
                    return message.channel.send(`${message.author}, watch your language! ⚠️`).then(m => setTimeout(() => m.delete(), 5000));
                }
            }

            // 2. Anti-Spam (Simple Rate Limit: 5 messages in 5 seconds)
            if (!spamMap.has(userId)) {
                spamMap.set(userId, []);
            }
            const userHistory = spamMap.get(userId);
            userHistory.push(now);

            // Remove messages older than 5 seconds
            const recentMessages = userHistory.filter(timestamp => now - timestamp < 5000);
            spamMap.set(userId, recentMessages);

            if (recentMessages.length > 5) {
                if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                    // Timeout for 1 minute
                    await message.member.timeout(60 * 1000, "Anti-Spam Auto-Mod").catch(() => { });
                    return message.channel.send(`${message.author} has been muted for spamming. 🔇`);
                }
            }
            // -----------------------

            // --- XP SYSTEM ---
            if (!cooldowns.has(userId)) {
                cooldowns.set(userId, now);
                setTimeout(() => cooldowns.delete(userId), 60000); // 1 min cooldown

                const user = getUser(userId, guildId);
                const xpGain = Math.floor(Math.random() * 10) + 15; // 15-25 XP
                const newXp = user.xp + xpGain;
                const nextLevel = (user.level + 1) * 100;

                let newLevel = user.level;
                if (newXp >= nextLevel) {
                    newLevel++;
                    message.channel.send(`🎉 ${message.author}, you leveled up to **Level ${newLevel}**!`);
                }

                updateUser(userId, guildId, { xp: newXp, level: newLevel });
            }
            // -----------------

            // --- COMMAND HANDLING ---
            const config = getGuildConfig(guildId);
            const prefix = config.prefix || ',';

            if (!message.content.startsWith(prefix)) return;

            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = client.prefixCommands.get(commandName);

            if (!command) return;

            // Permissions Check
            if (command.permissions) {
                if (!message.member.permissions.has(command.permissions)) {
                    return message.reply({ content: `❌ You need \`${command.permissions}\` permission to use this command.` });
                }
            }

            // Bot Permissions Check
            if (command.botPermissions) {
                if (!message.guild.members.me.permissions.has(command.botPermissions)) {
                    return message.reply({ content: `❌ I need \`${command.botPermissions}\` permission to execute this command.` });
                }
            }

            // Global Rules Check
            if (!await checkRules(message, message.author.id)) return;

            await command.execute(message, args, client);

        } catch (error) {
            console.error("Message Event Error:", error);
            // Try to reply if possible
            if (message && message.channel) {
                message.reply({ content: '❌ A critical error occurred while processing your message.' }).catch(() => { });
            }
        }
    },
};
