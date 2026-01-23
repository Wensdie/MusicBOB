import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  TextChannel,
} from "discord.js";
import * as commands from "./commands";
import { MusicPlayer, Teams, Reminder } from "./services";
import type { Command } from "./types";

export class Bot {
  private readonly discordClient: Client;
  private static instance: Bot;

  private constructor(private readonly discordToken: string) {
    this.discordClient = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });

    this.discordClient.services = {
      Teams: undefined,
      MusicPlayer: undefined,
      Reminder: () => Reminder(this.discordClient),
    };
    this.discordClient.commands = new Collection<string, Command>();
    this.discordClient.services.Reminder();
    this.discordClient.on(Events.InteractionCreate, (interaction) => {
      if (!interaction.isChatInputCommand()) {
        return;
      }

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        throw new Error(
          `Command "${interaction.commandName}" is registered in Discord API, but was not initialized correctly or does not exist.`,
        );
      }

      command.execute(interaction).catch(async (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : JSON.stringify(error);
        console.log(
          `[WARNING] Error while executing command ${interaction.commandName}:\n${errorMessage}`,
        );

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: `Error: ${errorMessage.slice(-1900)}`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `Error:  ${errorMessage.slice(-1900)}`,
            ephemeral: true,
          });
        }
      });
    });
  }

  public static getInstance(discordToken?: string): Bot {
    if (!Bot.instance && discordToken) {
      Bot.instance = new Bot(discordToken);
    }
    return Bot.instance;
  }

  public async authorize(): Promise<void> {
    console.log("[LOG] Authorizing to Discord API.");
    await this.discordClient.login(this.discordToken);
  }

  public loadUtilities(): void {
    console.log("[LOG] Loading Bot utilities.");
    this.loadCommands();
  }

  public getTeams(): Teams {
    if (!this.discordClient.services.Teams) {
      this.discordClient.services.Teams = new Teams();
    }
    return this.discordClient.services.Teams;
  }

  public getMusicPlayer(channel: TextChannel): MusicPlayer {
    if (!this.discordClient.services.MusicPlayer) {
      this.discordClient.services.MusicPlayer =
        MusicPlayer.getInstance(channel);
    }

    return this.discordClient.services.MusicPlayer;
  }

  private loadCommands(): void {
    console.log("[LOG] Loading bot commands.");
    for (const command of Object.values(commands)) {
      this.discordClient.commands.set(command.data.name, command);
    }
    console.log("[LOG] Commands loaded succefully.");
  }
}
