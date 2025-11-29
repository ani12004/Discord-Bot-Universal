export async function handleRoleCommand(client, message, args) {
  const ownerId = message.guild.ownerId;

  // Allow only server owner OR admins
  if (
    message.author.id !== ownerId &&
    !message.member.permissions.has("Administrator")
  ) {
    return message.reply("❌ Only admins or the server owner can use this command.");
  }

  // Expect: s?role <roleName> <@user>
  const roleName = args[0];
  const user = message.mentions.members.first();

  if (!roleName || !user) {
    return message.reply("❗ Usage: `s?role <roleName> <@user>`");
  }

  // Find role by name (case-insensitive)
  const role = message.guild.roles.cache.find(
    r => r.name.toLowerCase() === roleName.toLowerCase()
  );

  if (!role) {
    return message.reply("❌ Role not found. Make sure the name is exact.");
  }

  try {
    await user.roles.add(role);
    message.reply(`✅ Added **${role.name}** to **${user.user.tag}**.`);
  } catch (err) {
    console.error(err);
    message.reply("⚠️ I couldn't add that role. Check my permissions or role hierarchy.");
  }
}
