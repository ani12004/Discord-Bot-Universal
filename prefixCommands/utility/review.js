export default {
  name: "review",

  async execute(message, args, client) {
    const review = args.join(" ");
    if (!review) return message.reply("❌ Please type your review.");

    message.reply("💖 Thanks for your review! Logged successfully.");
  }
};
