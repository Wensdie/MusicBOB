import { Collection } from 'discord.js';
import MusicPlayer from './services/musicPlayer.js';
import Teams from './services/teams.js';
import type Command from './types/command.js';

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
    services: { Teams: Teams; MusicPlayer: MusicPlayer };
  }
}
