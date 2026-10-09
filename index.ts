import { Client, GatewayIntentBits } from "discord.js";
import { Bot } from "./structs/Bot";
import { config } from "./utils/config";

if (!config.TOKEN || config.TOKEN === "PUT_YOUR_DISCORD_BOT_TOKEN_HERE" || config.TOKEN === "PASTE_BOT_TOKEN_HERE") {
  throw new Error("Missing Discord bot token. Add TOKEN to .env or config.json, then restart the bot.");
}

// Only intents required for slash commands, voice state and music playback are enabled.
// This avoids privileged Message Content / Server Members intents and keeps the bot lean.
export const bot = new Bot(
  new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
  })
);
