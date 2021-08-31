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
            getServerStatus(Server.CFTOOLS_HOSTNAME, Server.CFTOOLS_PORT).then((details) => {

                let player_stats = details.status.players;
                console.log(`Polled server ${Server.NAME} (${Server.CFTOOLS_HOSTNAME}:${Server.CFTOOLS_PORT})...`);
                console.log(player_stats);

                let channel = Client.channels.cache.get(Server.CHANNEL_ID)
                let new_channel_name = `${Server.NAME}: ${ player_stats.online }/${ player_stats.slots }`

                if (channel.name == new_channel_name) return;

                channel.setName(new_channel_name)
                    .then(newChannel => console.log(`Setting channel name: ${newChannel.name}`))
                    .catch(console.error);
            }).catch(function (error) {
                console.log(error);
            });
        });
    }, Config.POLLING_INTERVAL * 1000);
});

Client.login(Config.BOT_TOKEN);

async function getServerStatus(hostname, port) {
    let cftools_client = new CFToolsClientBuilder().build();
    let details = cftools_client.getGameServerDetails({
        game: Game.DayZ,
        ip: hostname,
        port: port,
    })
    return await details;
}

