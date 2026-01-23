import { Collection } from "discord.js";
import { MusicPlayer, Teams } from "./services";
import type { Command } from "./types";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
    services: {
      Teams?: Teams;
      MusicPlayer?: MusicPlayer;
      Statistics?: Statistics;
      Reminder: Reminder;
    };
  }
}
