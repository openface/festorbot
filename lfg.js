const Discord = require('discord.js');

let LfgRegex = null;
let lastPingAt = 0;

function lfgEnabled(Config) {
    const L = Config.LFG;
    if (!L) return false;
    if (L.ENABLED === false) return false;
    if (!L.ROLE_ID || !L.CHANNEL_ID) return false;
    return true;
}

function buildKeywordRegex(keywords) {
    const list = (keywords && keywords.length) ? keywords : ['lfg'];
    const escaped = list.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return new RegExp(`\\b(${escaped.join('|')})\\b`, 'i');
}

async function registerCommands(Client, Config) {
    const guild = await Client.guilds.fetch(Config.GUILD_ID);
    await guild.commands.create({
        name: 'lfg',
        description: 'Toggle the LFG role on or off for yourself.',
    });
    console.log(`LFG slash command registered in guild ${guild.name} (${guild.id}).`);
}

function attachHandlers(Client, Config) {
    LfgRegex = buildKeywordRegex(Config.LFG.KEYWORDS);

    Client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;
        if (interaction.commandName !== 'lfg') return;

        const roleId = Config.LFG.ROLE_ID;
        const channelId = Config.LFG.CHANNEL_ID;
        const member = interaction.member;

        try {
            if (member.roles.cache.has(roleId)) {
                await member.roles.remove(roleId);
                await interaction.reply({ content: "You're no longer LFG.", ephemeral: true });
            } else {
                await member.roles.add(roleId);
                await interaction.reply({
                    content: `You're now LFG — head to <#${channelId}>.`,
                    ephemeral: true,
                });
            }
        } catch (error) {
            console.error('LFG role toggle failed:', error);
            await interaction.reply({
                content: "Couldn't update your LFG role. The bot's role probably needs to be above @LFG in the role list — ask an admin to fix it.",
                ephemeral: true,
            });
        }
    });

    Client.on('messageCreate', (message) => {
        if (message.author.bot) return;
        if (message.channelId !== Config.LFG.CHANNEL_ID) return;

        const roleId = Config.LFG.ROLE_ID;
        const keywordMatch = LfgRegex.test(message.content);
        const roleMention = message.mentions.roles.has(roleId);

        if (!keywordMatch && !roleMention) return;

        const cooldownMs = (Config.LFG.PING_COOLDOWN_MINUTES || 10) * 60 * 1000;

        if (roleMention) {
            const role = message.guild.roles.cache.get(roleId);
            if (role && role.mentionable) {
                lastPingAt = Date.now();
                return;
            }
        }

        if (Date.now() - lastPingAt < cooldownMs) return;

        message.channel.send({
            content: `<@&${roleId}>`,
            allowedMentions: { roles: [roleId] },
        }).then(() => {
            lastPingAt = Date.now();
        }).catch((error) => {
            console.error('LFG ping send failed:', error);
        });
    });
}

module.exports = {
    lfgEnabled,
    registerCommands,
    attachHandlers,
};
