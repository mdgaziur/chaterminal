import { log } from "../../io/log";
import { syncreadline } from "../../io/syncreadline";
import fetch from 'node-fetch';
import { validateURL } from "../../utils/urlvalidation";
import ora from 'ora';
import { getAuthToken } from "./getAuthToken";
import { writeConfigFile } from "./writeConfigFile";

export type config = {
    server: string
    authToken: string
    signedIn: boolean
}

export async function genConfig(firstTime: boolean = true) {
    firstTime && log(`
Welcome to Chaterminal!
Let's configure to get started
    `);

    let config: config = {
        server: '',
        authToken: '',
        signedIn: false
    };

    while(1) {
        let serverURL = await syncreadline("Server address -> ");
        serverURL += ":6396";
        const spinner = ora('Checking server...').start();
        if(!validateURL(serverURL)) {
            spinner.fail("Invalid url!");
            continue;
        }
        try {
            let resp = await fetch(serverURL + "/verify", {
                timeout: 10000
            });
            if(!resp.ok || await resp.text() !== "Chaterminal") {
                spinner.fail("Invalid server!");
            }
            else {
                spinner.succeed("Server is valid. Continuing...");
                config.server = serverURL;
                break;
            }
        } catch(e) {
            spinner.fail("Invalid server or network problem!");
            log(e.message);
        }
        spinner.stop();
    }
    config.authToken = await getAuthToken(config.server);
    config.signedIn = true;

    writeConfigFile(JSON.stringify(config));
}