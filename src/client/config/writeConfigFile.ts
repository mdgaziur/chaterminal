import { existsSync, mkdirSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

export function writeConfigFile(configData: string) {
    let configDir = join(homedir(), ".config/Chaterminal");
    if(!existsSync(configDir)) {
        mkdirSync(configDir);
    }
    writeFileSync(join(configDir, "config.json"), configData);
}