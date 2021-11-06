// Require the necessary discord.js classes
const Discord = require('discord.js');
const Gamedig = require('gamedig');
const Config = require('./config.json');

const Client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS],
    rejectOnRateLimit: () => true
});

// Handle ctrl-c to run bot when run interactively
process.on('SIGINT', () => {
    console.info("Interrupted!")
    process.exit(0)
});

// forces min 60 secs to avoid spamming
const PollingIntervalSeconds = Math.max(Config.POLLING_INTERVAL, 60);

// Store game info from last poll attempt
let Cache = new Map();

console.log('Starting Discord bot...');

// When the client is ready, run this code (only once)
Client.once('ready', () => {
    console.log(`Connected to Discord as user ${Client.user.username}.`);

    Client.user.setPresence({
        status: 'idle',
        activities: [{
            name: Config.PRESENCE_NAME,
            type: Config.PRESENCE_TYPE,
        }]
    });

    setInterval(() => {
        Config.SERVERS.forEach((Server) => {
            console.debug(`Polling server ${Server.NAME} (${Server.ADDRESS}:${Server.PORT})...`);
            let new_channel_name;

            Gamedig.query({
                type: 'dayz',
                host: Server.ADDRESS,
                port: Server.PORT,
                maxAttempts: 2,
                requestRules: true
            }).then((response) => {
                //console.debug("Got Game Info");

                let players_online = response.raw.numplayers;
                let max_players = response.maxplayers;
                let queued_players = response.raw.queue;
                //let ping = response.ping;

                // build a new channel name from current game data
                let new_channel_name = `${Server.NAME}: ${players_online}/${max_players}`;

                // append queued if any
                if (queued_players > 0) {
                    new_channel_name = `${new_channel_name} (+${queued_players})`;
                }

                UpdateChannelName(new_channel_name, Server);
            }).catch((error) => {
                console.error(`Unable to query game server! (${Server.ADDRESS}:${Server.PORT})`);
                console.error(error);

                let new_channel_name = `${Server.NAME}: offline`;

                UpdateChannelName(new_channel_name, Server);
            });
        });
    }, PollingIntervalSeconds * 1000);
    console.log(`Polling game servers every ${PollingIntervalSeconds} seconds...`);
});

function UpdateChannelName(new_channel_name, Server) {
    console.debug(`Current: ${new_channel_name}`);

    // do nothing if it's what we already have cached
    if (Cache.has(Server.NAME) && Cache.get(Server.NAME) == new_channel_name) {
        //console.debug('Cached, no change.');
        return;
    }

    // set the discord channel name and save to cache
    let Channel = Client.channels.cache.get(Server.CHANNEL_ID);
    Channel.setName(new_channel_name).then((newChannel) => {
        console.log(`Channel ID ${Server.CHANNEL_ID} is now named: ${newChannel.name}`)
        Cache.set(Server.NAME, newChannel.name);
    }).catch(console.error);
}

Client.login(Config.BOT_TOKEN);