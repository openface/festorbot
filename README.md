
```
  o888o ooooooooooo  oooooooo8 ooooooooooo   ooooooo  oooooooooo  oooo          ooooooo   ooooooooooo 
o888oo   888    88  888        88  888  88 o888   888o 888    888  888ooooo   o888   888o 88  888  88 
 888     888ooo8     888oooooo     888     888     888 888oooo88   888    888 888     888     888     
 888     888    oo          888    888     888o   o888 888  88o    888    888 888o   o888     888     
o888o   o888ooo8888 o88oooo888    o888o      88ooo88  o888o  88o8 o888ooo88     88ooo88      o888o    
```

## FestorBot (Yet Another DayZ Player Count Discord Bot)

Since YADPCDB is a terrible name for a project, we'll just call it *festor*.   FestorBot is a stupid-simple
node-based discord bot that queries your DayZ server for game information and updates your discord channel
names to reflect the current player counts.  It also has an optional **Looking For Group (LFG)** feature for opt-in role pings in a dedicated channel.

![image](https://user-images.githubusercontent.com/7429/133143394-e4cd3bac-1f24-4d92-914f-5185a1c9cd31.png)

#### Discord Setup

First, create an application in the [Discord Developer Portal](https://discord.com/developers/applications), add a bot to it, and copy the bot token (you'll need it for `BOT_TOKEN`).  Then under **OAuth2 → URL Generator**, tick the `bot` scope, select the permissions you need (at minimum `Manage Channels`), and open the generated URL to invite the bot to your server.

Secondly, create the discord voice channels that the bot will be responsible for within your discord 
server.  Use voice channels instead of text channels to be able to use special characters such as slash and parenthesis. 

##### LFG Setup

Skip this section if you only want player counts.  Otherwise:

- In the [Discord Developer Portal](https://discord.com/developers/applications), enable the **Server Members** and **Message Content** intents for your bot.
- Re-invite the bot with both the `bot` and `applications.commands` OAuth scopes (the latter is needed for `/lfg`).
- Grant the bot `Manage Roles`, `Send Messages`, and `Read Message History` (in addition to `Manage Channels`).
- Create a role named `@LFG` and a text channel named `#lfg` (names are up to you, only IDs matter).
- Drag the bot's role **above** `@LFG` in *Server Settings → Roles*, otherwise `/lfg` will fail.
- Decide how `@LFG` pings get delivered.  Discord will only push a notification to role-holders if the sender is allowed to mention the role, and there are two ways to allow it:
  - **Mark `@LFG` as Mentionable** (in the role settings).  Anyone — including the bot — can then ping it.  This is the simplest setup.
  - **Or grant the bot `Mention @everyone, @here, and All Roles`.**  The role stays locked down so regular users can't ping it, but the bot still can.
  - If you do neither, the bot's `<@&LFG>` will render as a styled pill in chat but Discord will silently drop the notification — role-holders see nothing.
- If `#lfg` is private, grant the bot channel-level `View Channel`, `Send Messages`, and `Read Message History` — server-wide perms don't override channel restrictions.
- With Developer Mode on, right-click → Copy ID for the server, the `@LFG` role, and the `#lfg` channel.  You'll need these for `GUILD_ID`, `LFG.ROLE_ID`, and `LFG.CHANNEL_ID`.

#### Bot Configuration

Simply rename the included `config.json.sample` to `config.json` and edit accordingly.

| Option | Description |
| ------ | ----------- |
| BOT_TOKEN                 | Discord bot token to identify it on discord |
| PRESENCE_NAME             | Name of activity the bot is doing |
| PRESENCE_TYPE             | Type of activity the bot is doing (PLAYING, STREAMING, WATCHING, etc) |
| POLLING_INTERVAL          | How often (in seconds) to poll server for game info |
| GUILD_ID                  | Discord server ID, required for LFG to register the `/lfg` slash command |
| LFG                       | Optional LFG config block; omit entirely to disable the feature |
| LFG.ENABLED               | Set to `false` to disable LFG without removing the block (defaults to `true`) |
| LFG.ROLE_ID               | ID of the `@LFG` role |
| LFG.CHANNEL_ID            | ID of the `#lfg` text channel |
| LFG.KEYWORDS              | Words that trigger an `@LFG` ping (default `["lfg"]`, whole-word match) |
| LFG.PING_COOLDOWN_MINUTES | Minimum minutes between bot-issued `@LFG` pings |
| SERVERS.NAME              | Name of this DayZ game server (a short name) |
| SERVERS.CHANNEL_ID        | The discord voice channel ID that will be renamed |
| SERVERS.ADDRESS           | The server address or IP of your DayZ game server |
| SERVERS.PORT              | Your DayZ steam query port (Game port also works) |

Note that the Discord API has a rate limit of 2 per 10 minutes in place for channel renames.  For this reason, you 
shouldn't set the `POLLING_INTERVAL` to less than 2 or 3 minutes anyway because the discord channel will not be updated.

#### LFG Usage

- Type `/lfg` anywhere to toggle the role on or off for yourself.  The bot replies privately.
- In `#lfg`, post a message containing `lfg` (e.g. `lfg duo chernarus`) or `@`-mention `@LFG` to ping the role.  A cooldown (default 10 min) prevents spam.
- `lfg` only matches as a whole word, so `gg` or `lfgear` won't trigger a ping.

#### Running Directly

```
npm install
node .
```

#### Running in Docker

```
docker compose up --build [-d]
```