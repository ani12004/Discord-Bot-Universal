import { findTicketOwner, removeTicket } from "../../utils/modmailDB.js";

export default {
  name: "close",

  async execute(message, args, client) {
    const channel = message.channel;
    const ownerId = findTicketOwner(channel.id);

    if (!ownerId)
      return message.reply("❌ This is not a ticket channel.");

    await message.reply("🗑️ Closing ticket in 2 seconds...");

    removeTicket(ownerId);

    setTimeout(() => {
      channel.delete().catch(() => { });
    }, 2000);
  }
};
