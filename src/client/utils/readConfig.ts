import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { config } from "../config/validConfig";

export function readConfig():config {
    let configData = readFileSync(join(homedir(), '.config/Chaterminal/config.json'));
    let data = JSON.parse(configData.toString());
    return data;
}