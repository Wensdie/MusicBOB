import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { z } from 'zod';

export const commandSchema = z.object({
  data: z.instanceof(SlashCommandBuilder),
  execute: z
    .function()
    .args(
      z.custom<ChatInputCommandInteraction>(
        (arg) => {
          return arg instanceof ChatInputCommandInteraction;
        },
        {
          message: 'execute argument must be a ChatInputCommandInteraction',
        },
      ),
    )
    .returns(z.promise(z.void())),
});
