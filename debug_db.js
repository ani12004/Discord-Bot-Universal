import db from './utils/database.js';

const users = db.prepare('SELECT * FROM users').all();
console.log('Total Users:', users.length);
console.log('Users with balance > 0:', users.filter(u => u.balance > 0));

const configs = db.prepare('SELECT * FROM guild_configs').all();
console.log('Guild Configs:', configs);
