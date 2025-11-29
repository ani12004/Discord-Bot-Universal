import { EmbedBuilder } from "discord.js";

export default {
  name: "ping",
  description: "Checks the bot's latency.",
  aliases: ["latency"],
  async execute(message, args, client) {
    const msg = await message.channel.send("Pinging...");
    const latency = msg.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🏓 Pong!")
      .addFields(
        { name: "Latency", value: `${latency}ms`, inline: true },
        { name: "API Latency", value: `${apiLatency}ms`, inline: true }
      );

    msg.edit({ content: null, embeds: [embed] });
  },
};
