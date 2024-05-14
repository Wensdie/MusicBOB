var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
function loadServices(bot) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const folderPath = "services";
            const folderFiles = fs.readdirSync(folderPath);
            console.log("Loading bot services.");
            for (const file of folderFiles) {
                const { default: service } = yield import("../services/" + file);
                bot.services.set(service.name);
            }
            console.log("Services loaded succefully.");
        }
        catch (er) {
            console.error("Error loading services: " + er);
        }
    });
}
export default loadServices;
