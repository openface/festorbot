## CFTools DayZ Player Counting Discord Bot

Since CDPCDB is a terrible name for a project, we'll just call it *festor*.   The FesterBot is a stupid-simple
node-based discord bot that integrates in with CFTools Cloud to retrieve DayZ game server statistics and updates
your discord channel names to reflect the current player counts.

Eg. "HotGarbage: 0/60"

#### Discord

First, be sure to create the discord channels that the bot will be responsible for managing.   Be sure that the bot
has the permissions necessary for renaming those channels.  Also, use voice channels instead of text channels to be
able to use special characters such as slash and parenthesis.

#### CFTools Cloud

You'll need to have your DayZ servers properly setup with CFTools Cloud.   Retrieving game server details
from CFTools Cloud can be done without authentication, so this setup is dead simple.

#### Configuration

Simply rename the included `config.json.sample` to `config.json` and edit accordingly.

| Option | Description |
| ------ | ----------- |
| BOT_TOKEN                 | Discord bot token to identify it on discord |
| PRESENCE_NAME             | Name of activity the bot is doing |
| PRESENCE_TYPE             | Type of activity the bot is doing (PLAYING, STREAMING, WATCHING, etc) |
| POLLING_INTERVAL          | How often (in seconds) festor will poll CFToolsCloud for game stats |
| SERVERS.NAME              | Name of your DayZ server (short name) |
| SERVERS.CHANNEL_ID        | The voice channel ID to rename to reflect the player count |
| SERVERS.CFTOOLS_HOSTNAME  | The hostname or IP of your DayZ game server |
| SERVERS.CFTOOLS_PORT      | Your DayZ game server port |

#### Running Directly

```
npm install
node .
```

#### Running in Docker

```
# Build image
docker build . -t openface/festorbot

# Run interactively (-it) or as a daemon (-d)
docker run -it --init openface/festorbot
docker run -d --init openface/festorbot
```

#### TODO

* Add queue support
* Maybe some other stuff