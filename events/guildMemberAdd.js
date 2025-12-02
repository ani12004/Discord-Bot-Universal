import { Events, EmbedBuilder } from "discord.js";
import { getGuildConfig } from "../utils/database.js";

export default {
  name: Events.GuildMemberAdd,
  async execute(member) {
    if (member.user.bot) return;

    const config = getGuildConfig(member.guild.id);
    const welcomeChannelId = config.welcome_channel;

    if (!welcomeChannelId) return;

    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel || !channel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor("#FFB6C1") // Pastel Pink
      .setAuthor({ name: `Welcome to ${member.guild.name}!`, iconURL: member.guild.iconURL({ dynamic: true }) })
      .setDescription(`${config.welcome_message || `Hello ${member}, welcome to **${member.guild.name}**! We are glad to have you here.`}\n\n**Please make sure to check the following channels:**\n• <id:customize> ・ rules - Read our rules!\n• <id:customize> ・ guides - Check our guides!`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Member #${member.guild.memberCount}` })
      .setTimestamp();

    channel.send({ content: `${member}`, embeds: [embed] }).catch(() => { });

    // Autorole
    if (config.autorole_id) {
      const role = member.guild.roles.cache.get(config.autorole_id);
      if (role) {
        member.roles.add(role).catch(() => { });
      }
    }
  },
};
