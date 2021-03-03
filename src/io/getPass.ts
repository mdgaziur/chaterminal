import { exit } from 'process';
import read from 'read';
import { log, type } from './log';

export function getPass(prompt: string): Promise<string> {
    return new Promise((res) => {
        read({
            prompt: prompt,
            silent: true
        }, (err, password) => {
            if(err) {
                log("[Error] Error happened while trying to get password: ", type.ERROR);
                log(err.message);
                log(err.stack);
                exit(1);
            }
            res(password);
        });
    });
}