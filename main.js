// Require the necessary discord.js classes
const Discord = require('discord.js');
const Config = require('./config.json');
const { CFToolsClientBuilder, Game } = require('cftools-sdk');

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

    const CFClient = new CFToolsClientBuilder().build();

    setInterval(() => {
        Config.SERVERS.forEach((Server) => {
            pollGameServerDetails(CFClient, Server).then((details) => {
                let player_stats = details.status.players;
                console.log(`Polled server ${Server.NAME} (${Server.CFTOOLS_HOSTNAME}:${Server.CFTOOLS_PORT})...`);

                Client.channels.fetch(Server.CHANNEL_ID).then((channel) => {
                    let new_channel_name;
                    if (details.online) {
                        // todo player_stats.queue
                        new_channel_name = `${Server.NAME}: ${player_stats.online}/${player_stats.slots}`
                    } else {
                        new_channel_name = `${Server.NAME}: offline`
                    }

                    // channel name is unchanged
                    if (channel.name == new_channel_name) return;
    
                    console.log(`Setting channel name: ${new_channel_name}`);
                    channel.setName(new_channel_name).catch(console.error);
                }).catch(console.error);

            }).catch(console.error);
        });
    }, Config.POLLING_INTERVAL * 1000);
});

Client.login(Config.BOT_TOKEN);

async function pollGameServerDetails(CFClient, Server) {
    let details = CFClient.getGameServerDetails({
        game: Game.DayZ,
        ip: Server.CFTOOLS_HOSTNAME,
        port: Server.CFTOOLS_PORT,
    })
    return await details;
}
