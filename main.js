// Require the necessary discord.js classes
const Discord = require('discord.js');
const Config = require('./config.json');

const Client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
Client.once('ready', () => {
    console.log(`Connected to discord as ${Client.user.username}.`);
    const channel = Client.channels.cache.get(Config.CHANNEL_ID)

    Client.user.setPresence({
        status: 'idle',
        activities: [{
            name: Config.PRESENCE_NAME,
            type: Config.PRESENCE_TYPE,
        }]
    });

    setInterval(() => {
        Config.SERVERS.forEach((Server) => {
            console.log(`Checking ${Server.NAME}...`)

            let channel = Client.channels.cache.get(Server.CHANNEL_ID)

            let new_channel_name = `${Server.NAME}: 1/60`

            if (channel.name != new_channel_name) {
                channel.setName(new_channel_name)
                    .then(newChannel => console.log(`Channel's new name is ${newChannel.name}`))
                    .catch(console.error);
            }
        });
    }, Config.UPDATE_INTERVAL);
});

Client.login(Config.BOT_TOKEN);



