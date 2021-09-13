// Require the necessary discord.js classes
const Discord = require('discord.js');
const Gamedig = require('gamedig');
const Config = require('./config.json');

const Client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });

// Handle ctrl-c to run bot when run interactively
process.on('SIGINT', () => {
    console.info("Interrupted")
    process.exit(0)
});

console.log('Starting Discord Bot...');

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
            console.log(`Polling server ${Server.NAME} (${Server.ADDRESS}:${Server.PORT})...`);
            let new_channel_name;

            getGameInfo(Server.ADDRESS, Server.PORT).then((response) => {
                //console.log(response);

                let players_online = response.raw.numplayers;
                let max_players = response.maxplayers;
                let queued_players = response.raw.queue;

                getDiscordChannel(Server.CHANNEL_ID).then((channel) => {
                    new_channel_name = `${Server.NAME}: ${players_online}/${max_players}`

                    if (channel.name == new_channel_name) return;

                    channel.setName(new_channel_name).then((newChannel) => {
                        console.log(`Channel ${channel.name} is now named: ${newChannel.name}`)
                    }).catch(console.error);

                }).catch((error) => {
                    console.error(`Unable to find discord channel! (${Server.CHANNEL_ID})`)
                });

            }).catch((error) => {
                console.error(`Unable to query server/port! (${Server.ADDRESS}:${Server.PORT})`);

                getDiscordChannel(Server.CHANNEL_ID).then((channel) => {
                    new_channel_name = `${Server.NAME}: offline`

                    if (channel.name == new_channel_name) return;

                    channel.setName(new_channel_name).then((newChannel) => {
                        console.log(`Channel ${channel.name} is now named: ${newChannel.name}`)
                    }).catch(console.error);

                }).catch((error) => {
                    console.error(`Unable to find discord channel! (${Server.CHANNEL_ID})`)
                });
            });
        });
    }, Math.max(Config.POLLING_INTERVAL, 60) * 1000); // forces min 60 secs to avoid spamming
});

Client.login(Config.BOT_TOKEN);

async function getGameInfo(address, port) {
    //console.debug("Fetching game data...")
    let response = Gamedig.query({
        type: 'dayz',
        host: address,
        port: port,
        requestRules: true
    })
    return await response;
}

async function getDiscordChannel(channel_id) {
    //console.debug("Fetching discord channel...")
    let response = Client.channels.fetch(channel_id)
    return await response;
}