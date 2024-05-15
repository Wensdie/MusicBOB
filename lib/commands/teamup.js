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
const teamup = {
    data: new SlashCommandBuilder()
        .setName("teamup")
        .setDescription("Divide people on voice chat into 2 teams or more.")
        .addStringOption(option => option.setName("amount")
        .setDescription("Divide into \"amount\" teams.")
        .setRequired(false)),
    execute(interaciton) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!((interaciton.member).voice.channelId)) {
                yield interaciton.reply({ content: "You have to join voice chat first.", ephemeral: true });
                return;
            }
            const members = ((interaciton.member).voice.channel).members.filter(user => user.displayName !== "MusicBOB");
            if (members.size === 1) {
                yield interaciton.reply({ content: "For ever alone. :(", ephemeral: true });
                return;
            }
            let amount = 0;
            if (interaciton.options.getString("amount")) {
                if (Number(interaciton.options.getString("amount")) > 2 && Number(interaciton.options.getString("amount")) < members.size)
                    amount = Number(interaciton.options.getString("amount"));
                else {
                    yield interaciton.reply({ content: "invalid team amount.", ephemeral: true });
                    return;
                }
            }
            else {
                amount = 2;
            }
            const numbers = [];
            let j = 1;
            for (let i = 0; i < members.size; i++) {
                numbers.push(j);
                if (j == amount)
                    j = 1;
                else
                    j++;
            }
            shuffleArray(numbers);
            const membersTeams = [];
            let i = 0;
            for (const member of members) {
                membersTeams.push({
                    name: member[1].displayName,
                    team: numbers[i]
                });
                i++;
            }
            let message = "";
            for (let i = 1; i <= amount; i++) {
                message += "Team " + i + ":\n";
                for (const member of membersTeams) {
                    if (member.team == i) {
                        message += "⦿ " + member.name + "\n";
                    }
                }
                message += "\n\n";
            }
            yield interaciton.reply({ content: message });
            return;
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    let temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }
        });
    }
};
export default teamup;
