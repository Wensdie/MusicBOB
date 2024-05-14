var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SlashCommandBuilder } from "discord.js";
import ytdl from "ytdl-core";
const play = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Provided with youtube link starts playing music on voice channel.")
        .addStringOption(option => option.setName("url")
        .setDescription("Plays video from youtube.")
        .setRequired(true)),
    execute(interaciton) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = interaciton.options.getString("url");
            if (!url) {
                yield interaciton.reply(`Invalid url.`);
                return;
            }
            const songName = yield musicYT(url);
            yield interaciton.reply(`Playing song: ${songName}`);
        });
    }
};
function musicYT(videoURL) {
    return __awaiter(this, void 0, void 0, function* () {
        const title = yield ytdl.getInfo(videoURL).then((info) => {
            return info.videoDetails.title;
        });
        return title;
    });
}
export default play;
