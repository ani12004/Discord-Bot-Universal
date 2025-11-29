module.exports = {
    apps: [{
        name: "discord-bot-universal",
        script: "./index.js",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: "1G",
        env: {
            NODE_ENV: "production",
        },
    }, {
        name: "discord-bot-website",
        script: "./website/server.js",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: "500M",
        env: {
            NODE_ENV: "production",
            PORT: 3000
        }
    }]
};
