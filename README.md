# NFX Music Bot

A lightweight, self-hosted Discord music bot based on your EvoBot repository. It keeps the existing slash-command approach and upgrades the player message into an NFX-branded music panel with interactive controls, queue information, resilient queue error handling, and optional animated custom emoji support.

> This repository is derived from the open-source EvoBot project by Erit Islami. See `LICENSE` for the original license terms.

## Features

- `/play` song search or YouTube video URL
- `/playlist` YouTube playlist URL or playlist search
- `/search`, `/queue`, `/nowplaying`, `/lyrics`
- Pause/resume, skip, stop, shuffle, queue loop and volume controls
- One live **NFX MUSIC PANEL** message that updates as tracks change
- Two rows of buttons; controls only work for people in the same voice channel as the bot
- Optional custom animated emoji for the panel title, fields and controls
- A `yt-dlp` fallback for track metadata/stream extraction when the built-in `play-dl` extractor fails
- Less background work: only the required Discord gateway intents are enabled and the player pauses when nobody is listening
- Optional low-CPU mode that disables real-time volume processing

Music sources and extractors can change independently of the bot. YouTube extraction can occasionally break when YouTube changes its player; see **Troubleshooting** below.

## Requirements

- Node.js 20 or newer (LTS recommended)
- npm (included with Node.js)
- A Discord application and bot token
- Optional but recommended for extractor fallback: `yt-dlp` available on your system `PATH`

## Setup on Windows

1. Install Node.js 20 LTS or newer.
2. Download/extract this project.
3. Open the project folder in File Explorer and copy `.env.example` to `.env`.
4. Open `.env` in Notepad and replace `PASTE_BOT_TOKEN_HERE` with your bot token. Do not share or commit this file.
5. Open Command Prompt in this folder and run:

   ```bat
   npm install
   npm run start
   ```

   For a lighter runtime after the first setup, compile once and run the compiled build:

   ```bat
   npm run build
   node dist\index.js
   ```

The first start registers slash commands globally. Discord may take a little time to display newly registered commands.

## Discord Developer Portal

1. Open <https://discord.com/developers/applications> and select your bot application.
2. Under **Bot**, copy the token and put it in `.env` as `TOKEN=...`.
3. Under **OAuth2 → URL Generator**, choose the `bot` and `applications.commands` scopes.
4. Give the bot these server permissions: **View Channels**, **Send Messages**, **Embed Links**, **Read Message History**, **Connect**, and **Speak**. Add **Use External Emojis** only if you want to use emojis from another server.
5. Invite the bot to your server using the generated URL.

This build uses only the `Guilds` and `GuildVoiceStates` gateway intents; privileged Message Content intent is not required for its slash-command workflow.

## Optional `yt-dlp` fallback

The bot tries `play-dl` first and falls back to the `yt-dlp` executable if that stream cannot be created. Install a current `yt-dlp` build and make sure `yt-dlp --version` works in a new terminal. For Python installations, the usual command is:

```bat
py -m pip install -U yt-dlp
```

If the executable has a custom path, set it in `.env`, for example `YTDLP_PATH=C:\Tools\yt-dlp.exe`. This fallback is optional; it does not eliminate source-provider outages or extractor breakage.

## Make the interface animated

The panel has sensible Unicode emoji fallbacks. For **actual animated Discord emoji**, upload GIF emojis to a server where the bot can use them, copy each emoji's markup, and paste it into `.env`. Example markup looks like `<a:nfx_music:123456789012345678>`; the sample ID is only a format example and is not a real emoji.

Supported optional variables:

```dotenv
EMOJI_MUSIC=
EMOJI_PLAY=
EMOJI_PAUSE=
EMOJI_SKIP=
EMOJI_STOP=
EMOJI_VOLUME_DOWN=
EMOJI_VOLUME_UP=
EMOJI_SHUFFLE=
EMOJI_LOOP=
EMOJI_QUEUE=
EMOJI_LYRICS=
EMOJI_REQUESTER=
EMOJI_DURATION=
EMOJI_SOURCE=
```

Restart the bot after editing `.env`. The bot cannot invent or host Discord's animated emoji IDs; use actual emoji markup from a server you control.

## Low-CPU settings

- Keep `MAX_PLAYLIST_SIZE=10` to avoid huge queues.
- Set `ENABLE_VOLUME_CONTROL=false` to avoid inline-volume processing. Playback still works, but volume buttons and `/volume` will be disabled.
- The bot pauses if the voice connection has no listeners and disconnects after the configured `STAY_TIME` when the queue ends.
- You do not need to run a web dashboard or database for this bot.

## Troubleshooting

- **Bot won't start:** verify `TOKEN` in `.env`. A bot token is not the Application ID. Never paste the token into Discord messages or public screenshots; reset it from the Developer Portal if exposed.
- **Commands do not appear:** make sure the bot was invited with `applications.commands`; restart it and allow time for global command registration.
- **Cannot join voice:** check Connect and Speak permissions for the bot in that voice channel.
- **Music fails to start:** update dependencies with `npm install`, confirm the URL is public, and install/update `yt-dlp`. YouTube can change extraction behavior without warning.
- **Animated emoji shows as text:** check the ID/markup, confirm the emoji exists and the bot has permission to use it.

## Main files changed

- `structs/MusicQueue.ts` — queue recovery, voice lifecycle, a single premium control panel and button handlers
- `structs/Song.ts` — metadata fallback and optional yt-dlp stream fallback
- `utils/musicPanel.ts` — NFX branded embed, progress metadata, emoji configuration and button rows
- `utils/config.ts` — `.env` support even when `config.json` also exists
