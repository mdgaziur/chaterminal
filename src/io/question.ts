import { cyan } from "colors/safe";
import { log, type } from "./log";
import { syncreadline } from "./syncreadline";

export async function question(prompt: string, def: "Y" | "N"): Promise<boolean> {
    while(1) {
        if(def === "Y") {
            prompt += "[Y/n]";
        } else {
            prompt += "[y/N]";
        }
        let answer = await syncreadline(cyan(prompt));
        if(answer === "") {
            if(def === "Y") {
                return true;
            } else {
                return false;
            }
        } else if("Yy".includes(answer)) {
            return true;
        } else if("Nn".includes(answer)) {
            return false;
        } else {
            log('Unknown option!', type.ERROR);
        }
    }
}