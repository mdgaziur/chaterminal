import { existsSync, unlinkSync } from "fs";
import { homedir } from "os";
import { join } from "path";

export function rmConfig() {
    let configDir = join(homedir(), ".config/Chaterminal/config.json");
    if(!existsSync(configDir)) {
        return;
    }
    unlinkSync(configDir);
}