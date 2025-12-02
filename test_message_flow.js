import messageCreate from './events/messageCreate.js';
import { Collection } from 'discord.js';
import profileCommand from './prefixCommands/social/profile.js';
import setbioCommand from './prefixCommands/social/setbio.js';

// Mock Client
const client = {
    guilds: { cache: { first: () => ({ id: 'guild_1' }) } },
    prefixCommands: new Collection(),
    user: { id: 'bot_id' }
};

// Register Commands
client.prefixCommands.set('profile', profileCommand);
client.prefixCommands.set('setbio', setbioCommand);

// Mock Message
const message = {
    content: 's?profile',
    author: {
        id: 'test_user_flow',
        bot: false,
        username: 'TestUser',
        displayAvatarURL: () => 'http://avatar.url'
    },
    guild: {
        id: 'guild_1',
        members: { me: { permissions: { has: () => true } } }
    },
    member: { permissions: { has: () => true } },
    channel: {
        id: 'channel_1',
        send: (content) => console.log('Channel Send:', content)
    },
    reply: (content) => console.log('Message Reply:', content),
    mentions: { users: { first: () => null } }
};

async function runTest() {
    console.log("--- Testing s?profile ---");
    try {
        await messageCreate.execute(message, client);
    } catch (e) {
        console.error("Profile Test Failed:", e);
    }

    console.log("\n--- Testing s?setbio ---");
    message.content = 's?setbio I am a test user';
    try {
        await messageCreate.execute(message, client);
    } catch (e) {
        console.error("Setbio Test Failed:", e);
    }
}

runTest();
