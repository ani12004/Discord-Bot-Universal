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
      .setColor("Random")
      .setTitle(`Welcome to ${member.guild.name}!`)
      .setDescription(`Hello ${member}, welcome to the server! We are glad to have you here.`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    channel.send({ content: `Welcome ${member}!`, embeds: [embed] }).catch(() => { });

    // Autorole
    if (config.autorole_id) {
      const role = member.guild.roles.cache.get(config.autorole_id);
      if (role) {
        member.roles.add(role).catch(() => { });
      }
    }
  },
};
