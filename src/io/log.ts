import colors from 'colors/safe';

export enum type {
    ERROR,
    SUCCESS,
    WARNING,
    NORMAL,
    QUESTION
}

export function log(message: string, msgtype: type = type.NORMAL, newline: boolean = true) {
    if(newline) {
        message += "\n";
    }
    if(msgtype === type.ERROR) {
        message = "[Error] "+message;
        process.stdout.write(colors.red(message));
    }
    else if(msgtype === type.SUCCESS) {
        message = "[Success] "+message;
        process.stdout.write(colors.green(message));
    }
    else if(msgtype === type.WARNING) {
        message = "[Warning] "+message;
        process.stdout.write(colors.yellow(message));
    }
    else if(msgtype === type.NORMAL) {
        process.stdout.write(message);
    }
    else if(msgtype === type.QUESTION) {
        message = "[Question] "+message;
        process.stdout.write(colors.cyan(message));
    }
    else {
        log("Error occured in the program. This is likely a bug and should be reported", type.ERROR);
    }
}