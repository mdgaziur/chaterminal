import fetch from "node-fetch";
import { log, type } from "../../io/log";
import { readConfig } from "../utils/readConfig";

export default async function validUser(server: string): Promise<boolean> {
    let config = readConfig();
    let authToken = config.authToken;
    let reqBody = {
        authToken
    };
    let reqUrl = server + "/verify/user";
    try {
        let resp = await fetch(reqUrl, {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(!resp.ok) {
            return false;
        }
        return true;
    } catch(e) {
        log("Failed to connect to server while trying to verify authtoken! Detailed errors is logged bellow: ", type.ERROR);
        log(e.message, type.ERROR);
        process.exit(1);
    }
}