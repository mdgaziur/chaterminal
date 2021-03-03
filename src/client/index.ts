import { log, type } from "../io/log";
import { genConfig } from "./config/genConfig";
import { validConfig } from "./config/validConfig";
import validUser from "./config/validUser";
import startChaterminalUI from './ui';
import { readConfig } from "./utils/readConfig";

export async function client() {
    if(!validConfig()) {
        await genConfig();
    } else if(!await validUser(readConfig().server)) {
        log("User no longer exists on the server. Starting utility to create new config with new user...", type.ERROR);
        await genConfig();
    }
    startChaterminalUI();
}