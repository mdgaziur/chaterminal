import { exit } from "process";
import { client } from "../client";
import { log, type } from "../io/log";
import server from "../server";

function printArgsHelp() {
    log(`
Chaterminal - A command line based chat application

Available arguments:
-h\t\t\tShows this message
-s\t\t\tStarts the server
-n\t\t\tIt's same as starting the app without arguments. Starts chat client.
`);
}

export default function useArgs() {
    let args = process.argv;
    let command = args[2];
    if(!command) {
        client();
    }
    else if(command === "-h") {
        printArgsHelp();
        exit(0);
    }
    else if(command === "-s") {
        server();
    }
    else if(command === "-n") {
        client();
        exit(0);
    }
    else {
        log("Unknown argument!", type.ERROR, false);
        printArgsHelp();
        exit(1);
    }
}