
```
  o888o ooooooooooo  oooooooo8 ooooooooooo   ooooooo  oooooooooo  oooo          ooooooo   ooooooooooo 
o888oo   888    88  888        88  888  88 o888   888o 888    888  888ooooo   o888   888o 88  888  88 
 888     888ooo8     888oooooo     888     888     888 888oooo88   888    888 888     888     888     
 888     888    oo          888    888     888o   o888 888  88o    888    888 888o   o888     888     
o888o   o888ooo8888 o88oooo888    o888o      88ooo88  o888o  88o8 o888ooo88     88ooo88      o888o    
```

## FestorBot (Yet Another DayZ Player Count Discord Bot)

Since YADPCDB is a terrible name for a project, we'll just call it *festor*.   The FesterBot is a stupid-simple
node-based discord bot that queries your DayZ server for game information and updates your discord channel
names to reflect the current player counts.

![image](https://user-images.githubusercontent.com/7429/133143394-e4cd3bac-1f24-4d92-914f-5185a1c9cd31.png)

#### Discord Setup

First, invite the bot into your discord server.  We'll assume you know how this done.

Secondly, create the discord voice channels that the bot will be responsible for within your discord 
server.   Be sure that the bot has the permissions necessary for renaming those channels.  Make them voice 
channels instead of text channels to be able to use special characters such as slash and parenthesis. 

#### Bot Configuration

Simply rename the included `config.json.sample` to `config.json` and edit accordingly.

| Option | Description |
| ------ | ----------- |
| BOT_TOKEN                 | Discord bot token to identify it on discord |
| PRESENCE_NAME             | Name of activity the bot is doing |
| PRESENCE_TYPE             | Type of activity the bot is doing (PLAYING, STREAMING, WATCHING, etc) |
| POLLING_INTERVAL          | How often (in seconds) to poll server for game info |
| SERVERS.NAME              | Name of this DayZ game server (a short name) |
| SERVERS.CHANNEL_ID        | The discord voice channel ID that will be renamed |
| SERVERS.ADDRESS           | The server address or IP of your DayZ game server |
| SERVERS.PORT              | Your DayZ steam query port (Game port also works) |

Note that the Discord API has a rate limit of 2 per 10 minutes in place for channel renaming.  For this reason, you 
shouldn't set the POLLING_INTERVAL to less than 2 or 3 minutes anyway because the discord channel will not be updated.

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
