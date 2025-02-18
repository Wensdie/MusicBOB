import { z } from 'zod';
import { commandSchema } from '../schemas/commandSchema';

export type Command = z.infer<typeof commandSchema>;
