
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
names to reflect the current player counts.  It also provides an optional **Looking For Group (LFG)** feature
so players can opt in to an `@LFG` role and find groups in a dedicated channel.

![image](https://user-images.githubusercontent.com/7429/133143394-e4cd3bac-1f24-4d92-914f-5185a1c9cd31.png)

#### Discord Setup

First, invite the bot into your discord server.  We'll assume you know how this done.

Secondly, create the discord voice channels that the bot will be responsible for within your discord 
server.   Be sure that the bot has the permissions necessary for renaming those channels.  Make them voice 
channels instead of text channels to be able to use special characters such as slash and parenthesis. 

##### Required intents and OAuth scopes (LFG only)

If you plan to enable the LFG feature, the bot needs a few extra things:

- In the [Discord Developer Portal](https://discord.com/developers/applications) → your application → **Bot**, toggle on:
  - **Server Members Intent** — so the bot can add/remove the `@LFG` role.
  - **Message Content Intent** — so the bot can read messages in your `#lfg` channel.
- When inviting/re-inviting the bot, the OAuth URL must request both the `bot` and `applications.commands` scopes (the second one is needed for the `/lfg` slash command).
- Grant the bot these permissions in the server: `Manage Roles`, `Send Messages`, `Read Message History`, and (for the existing feature) `Manage Channels`.
- Also grant **either** `Mention @everyone, @here, and All Roles` **or** mark the `@LFG` role itself as Mentionable (see below).  Without one of these, the bot's `<@&LFG>` will render as a styled pill but will not actually notify role-holders.

If you are only using the player-count feature, none of the above is required.

##### LFG feature setup

- Create a role named `@LFG` (the name is up to you — only the ID matters).  Decide whether to mark it **"Allow anyone to @mention this role"**:
  - **On (simplest):** users can `@LFG` directly and Discord notifies role-holders.  The bot detects this case and suppresses its own echo ping.  The bot's own keyword-triggered ping also notifies, because the role is mentionable to everyone (bot included).
  - **Off:** only the bot can notify role-holders, and **only** if the bot has been granted the `Mention @everyone, @here, and All Roles` permission.  Without that permission, the bot's `<@&LFG>` mention will render as a styled pill but will silently fail to notify anyone.  If unsure, leave the role Mentionable.
- Create a text channel named `#lfg` (again the name is up to you).  Anyone who can see the channel can post and trigger pings; the role is just for receiving notifications.
- **If the channel is private** (has permission overrides restricting who can view it), explicitly grant the bot (or the bot's role) access to that channel: `View Channel`, `Send Messages`, `Read Message History`.  Server-wide permissions do not override channel-level restrictions, and without channel-level access the bot will not receive `messageCreate` events from that channel at all — keywords will silently do nothing.
- **Crucial:** drag the bot's own role **above** `@LFG` in *Server Settings → Roles*.  Discord forbids a role from managing roles equal to or above it; without this, `/lfg` will fail with a permission error.
- Grab the IDs (right-click → Copy ID with Developer Mode on) for:
  - The server (guild) → `GUILD_ID`
  - The `@LFG` role → `LFG.ROLE_ID`
  - The `#lfg` channel → `LFG.CHANNEL_ID`

#### Bot Configuration

Simply rename the included `config.json.sample` to `config.json` and edit accordingly.

| Option | Description |
| ------ | ----------- |
| BOT_TOKEN                 | Discord bot token to identify it on discord |
| PRESENCE_NAME             | Name of activity the bot is doing |
| PRESENCE_TYPE             | Type of activity the bot is doing (PLAYING, STREAMING, WATCHING, etc) |
| POLLING_INTERVAL          | How often (in seconds) to poll server for game info |
| GUILD_ID                  | Discord server ID; used to register the `/lfg` slash command against this guild for instant updates.  Only required when LFG is enabled. |
| LFG                       | Optional config block for the Looking-For-Group feature.  Omit the whole block to disable LFG (the bot will run with DayZ-only behavior). |
| LFG.ENABLED               | Set to `false` to keep the LFG config in place but turn the feature off (useful as a temporary kill-switch).  Defaults to `true` when the block is present. |
| LFG.ROLE_ID               | ID of the `@LFG` role the bot adds and removes |
| LFG.CHANNEL_ID            | ID of the `#lfg` text channel the bot watches for keywords and role mentions |
| LFG.KEYWORDS              | Array of words (default `["lfg"]`) that trigger an `@LFG` ping when used as a whole word in any `#lfg` message |
| LFG.PING_COOLDOWN_MINUTES | Minimum minutes between consecutive `@LFG` pings from the bot |
| SERVERS.NAME              | Name of this DayZ game server (a short name) |
| SERVERS.CHANNEL_ID        | The discord voice channel ID that will be renamed |
| SERVERS.ADDRESS           | The server address or IP of your DayZ game server |
| SERVERS.PORT              | Your DayZ steam query port (Game port also works) |

Note that the Discord API has a rate limit of 2 per 10 minutes in place for channel renames.  For this reason, you 
shouldn't set the `POLLING_INTERVAL` to less than 2 or 3 minutes anyway because the discord channel will not be updated.

#### LFG Usage

- **Toggle the role:** type `/lfg` anywhere in the server.  The bot replies privately with "You're now LFG" or "You're no longer LFG."
- **Summon the role from `#lfg`:** either type a message containing the word `lfg` (e.g. `lfg duo chernarus`, `hey im lfg snowside`) or `@`-mention the `@LFG` role.  The bot pings `@LFG` once, then enforces a cooldown (default 10 min) before pinging again so the channel can be used for normal conversation without spamming role-holders.
- Casual chat that doesn't contain `lfg` as a standalone word — `gg`, `anyone seen my pliers?`, `lfgear` — never triggers a ping.
- **Disabling LFG:** either delete the entire `LFG` block from `config.json` (the bot reverts to DayZ-only behavior and stops requesting privileged intents), or set `LFG.ENABLED` to `false` to disable temporarily while keeping the IDs around.

#### Running Directly

```
npm install
node .
```

#### Running in Docker

```
docker compose up --build [-d]
```