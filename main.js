// Require the necessary discord.js classes
const Discord = require('discord.js');
const Config = require('./config.json');
const { CFToolsClientBuilder, Game } = require('cftools-sdk');

const Client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
Client.once('ready', () => {
    console.log(`Connected to discord as ${Client.user.username}.`);

    Client.user.setPresence({
        status: 'idle',
        activities: [{
            name: Config.PRESENCE_NAME,
            type: Config.PRESENCE_TYPE,
        }]
    });

    setInterval(() => {
        Config.SERVERS.forEach((Server) => {
            pollGameServerDetails(Server.CFTOOLS_HOSTNAME, Server.CFTOOLS_PORT).then((details) => {
                let player_stats = details.status.players;
                console.log(`Polled server ${Server.NAME} (${Server.CFTOOLS_HOSTNAME}:${Server.CFTOOLS_PORT})...`);
                console.log(player_stats);

                Client.channels.fetch(Server.CHANNEL_ID).then((channel) => {
                    let new_channel_name = `${Server.NAME}: ${player_stats.online}/${player_stats.slots}`

                    // channel name is unchanged
                    if (channel.name == new_channel_name) return;
    
                    channel.setName(new_channel_name).catch(console.error);
                }).catch(console.error);

            }).catch(console.error);
        });
    }, Config.POLLING_INTERVAL * 1000);
});

Client.login(Config.BOT_TOKEN);

async function pollGameServerDetails(hostname, port) {
    let cftools_client = new CFToolsClientBuilder().build();
    let details = cftools_client.getGameServerDetails({
        game: Game.DayZ,
        ip: hostname,
        port: port,
    })
    return await details;
}

