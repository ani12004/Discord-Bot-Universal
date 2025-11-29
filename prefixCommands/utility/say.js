export default {
  name: "say",

  async execute(message, args, client) {
    const text = args.join(" ");
    if (!text) return message.reply("❌ Provide a message!");

    message.channel.send(text);
  }
};
