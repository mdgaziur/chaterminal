import { isJWT } from "class-validator";
import { existsSync, readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

export type config = {
    authToken: string
    signedIn: boolean
    server: string
}

export function validConfig() {
    let configPath = join(homedir(), ".config/Chaterminal/config.json");
    if(!existsSync(configPath)) {
        return false;
    }
    let configFile = readFileSync(configPath);
    let configData: config;
    try {
        configData = JSON.parse(configFile.toString());
    }
    catch {
        return false;
    }
    if(!configData.server) {
        return false;
    }
    if(configData.signedIn) {
        if(!configData.authToken || !isJWT(configData.authToken)) {
            return false;
        }
    }
    return true;
}