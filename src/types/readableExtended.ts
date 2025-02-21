import { Readable } from 'node:stream';
export type readableExtended = Readable & {
    kill:(arg: string) => void;
};